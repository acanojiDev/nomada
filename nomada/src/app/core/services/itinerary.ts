import { inject, Injectable, signal } from '@angular/core';
import { SupabaseClient, RealtimeChannel, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { Observable, from, throwError, tap, map } from 'rxjs';
import { Auth } from './auth';
import { Travel } from '../interfaces/travel';

@Injectable({
  providedIn: 'root',
})
export class Itinerary {
  private auth = inject(Auth);
  private supabase: SupabaseClient | null = null;
  private travelsChannel: RealtimeChannel | null = null;

  private readonly TABLE = 'travel';

  // Signals
  currentTravel = signal<Travel | null>(null);
  userTravels = signal<Travel[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  travelsLoaded = signal(false);

  // Lazy Supabase client
  private get client(): SupabaseClient {
    if (!this.supabase) {
      this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
    }
    return this.supabase;
  }

  createItinerary(data: Partial<Travel>): Observable<Travel> {
    const user = this.auth.currentUser();
    if (!user) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    this.isLoading.set(true);
    this.error.set(null);

    return new Observable<Travel>((observer) => {
      let channel: RealtimeChannel | null = null;

      from(
        this.client
          .from(this.TABLE)
          .insert({
            ...data,
            userInfo: user.id,
            groqStatus: 'pending',
          })
          .select('*')
          .single(),
      ).subscribe({
        next: ({ data: insertedData, error }) => {
          if (error || !insertedData) {
            const errorMsg = error?.message || 'Error al crear el itinerario';
            this.error.set(errorMsg);
            this.isLoading.set(false);
            observer.error(new Error(errorMsg));
            return;
          }

          this.currentTravel.set(insertedData as Travel);

          channel = this.client
            .channel(`travel-${insertedData.id}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: this.TABLE,
                filter: `id=eq.${insertedData.id}`,
              },
              (payload) => {
                const updatedTravel = payload.new as Travel;

                if (updatedTravel.groqStatus === 'completed') {
                  this.currentTravel.set(updatedTravel);
                  this.isLoading.set(false);
                  observer.next(updatedTravel);
                  observer.complete();
                  channel?.unsubscribe();
                } else if (updatedTravel.groqStatus === 'error') {
                  const errorMsg = updatedTravel.error_message || 'Error al generar el itinerario';
                  this.error.set(errorMsg);
                  this.isLoading.set(false);
                  observer.error(new Error(errorMsg));
                  channel?.unsubscribe();
                }
              },
            )
            .subscribe();
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
          observer.error(err);
        },
      });

      return () => channel?.unsubscribe();
    });
  }

  getAllTravels(): Observable<Travel[]> {
    const user = this.auth.currentUser();
    if (!user) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    if (this.travelsLoaded()) {
      return from([this.userTravels()]);
    }

    this.isLoading.set(true);

    return from(
      this.client
        .from(this.TABLE)
        .select('*')
        .eq('userInfo', user.id)
        .order('created_at', { ascending: false }),
    ).pipe(
      tap(({ data }) => {
        this.userTravels.set(data as Travel[]);
        this.travelsLoaded.set(true);
        this.isLoading.set(false);
        this.subscribeToTravels();
      }),
      map(({ data }) => data as Travel[]),
    );
  }

  subscribeToTravels() {
    const user = this.auth.currentUser();
    if (!user || this.travelsChannel) return;

    this.travelsChannel = this.client
      .channel(`user-travels-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: this.TABLE,
          filter: `userInfo=eq.${user.id}`,
        },
        (payload) => {
          const current = this.userTravels();

          if (payload.eventType === 'INSERT') {
            this.userTravels.set([payload.new as Travel, ...current]);
          }
        },
      )
      .subscribe();
  }

  unsubscribeFromTravels() {
    this.travelsChannel?.unsubscribe().then(() => { 
      this.travelsChannel = null;
      this.travelsLoaded.set(false);
      this.userTravels.set([]);
    });
  }

  setCurrentTravelById(id: string) {
    this.currentTravel.set(this.userTravels().find((t) => t.id === id) || null);
  }
}
