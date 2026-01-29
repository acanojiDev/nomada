import { inject, Injectable, signal } from '@angular/core';
import { RealtimeChannel, SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { Observable, throwError, from } from 'rxjs';
import { Auth } from './auth';
import { Travel } from '../interfaces/travel';

@Injectable({
  providedIn: 'root',
})
export class Itinerary {
  private supabase: SupabaseClient;
  private readonly TABLE_NAME = 'travel';
  private auth = inject(Auth);
  private travelsChannel: RealtimeChannel | null = null;

  // Signals
  currentTravel = signal<Travel | null>(null);
  userTravels = signal<Travel[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  travelsLoaded = signal<boolean>(false);

  constructor() {
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
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
        this.supabase
          .from(this.TABLE_NAME)
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

          // Guardamos el travel inicial
          this.currentTravel.set(insertedData as Travel);

          channel = this.supabase
            .channel(`travel-${insertedData.id}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: this.TABLE_NAME,
                filter: `id=eq.${insertedData.id}`,
              },
              (payload) => {
                const updatedTravel = payload.new as Travel;

                if (updatedTravel.groqStatus === 'completed') {
                  this.currentTravel.set(updatedTravel);
                  this.isLoading.set(false);

                  this.userTravels.set([updatedTravel, ...this.userTravels()]);

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

  setCurrentTravelById(id: string): void {
    const travel = this.userTravels().find(t => t.id === id) || null;
    this.currentTravel.set(travel);
  }

  getAllTravels(): Observable<Travel[]> {
    const user = this.auth.currentUser();
    if (!user) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    if (this.travelsLoaded()) {
      return new Observable<Travel[]>((observer) => {
        observer.next(this.userTravels());
        observer.complete();
      });
    }

    this.isLoading.set(true);
    this.error.set(null);

    return new Observable<Travel[]>((observer) => {
      from(
        this.supabase
          .from(this.TABLE_NAME)
          .select('*')
          .eq('userInfo', user.id)
          .order('created_at', { ascending: false }),
      ).subscribe({
        next: ({ data, error }) => {
          if (error) {
            const errorMsg = error.message || 'Error al cargar itinerarios';
            this.error.set(errorMsg);
            this.isLoading.set(false);
            observer.error(new Error(errorMsg));
            return;
          }
          this.userTravels.set(data as Travel[]);
          this.travelsLoaded.set(true);
          this.isLoading.set(false);
          observer.next(data as Travel[]);
          observer.complete();
          this.subscribeToTravelChanges(user.id);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
          observer.error(err);
        },
      });

      return () => {};
    });
  }

  private subscribeToTravelChanges(userId: string) {
    if (this.travelsChannel) {
      this.travelsChannel.unsubscribe();
    }

    this.travelsChannel = this.supabase
      .channel(`user-travels-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.TABLE_NAME,
          filter: `userInfo=eq.${userId}`,
        },
        (payload) => {
          const currentTravels = this.userTravels();

          if (payload.eventType === 'INSERT') {
            this.userTravels.set([payload.new as Travel, ...currentTravels]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTravels = currentTravels.map((travel) =>
              travel.id === payload.new['id'] ? (payload.new as Travel) : travel,
            );
            this.userTravels.set(updatedTravels);
          } else if (payload.eventType === 'DELETE') {
            const filteredTravels = currentTravels.filter(
              (travel) => travel.id !== payload.old['id'],
            );
            this.userTravels.set(filteredTravels);
          }
        },
      )
      .subscribe();
  }

  unsubscribeFromTravels() {
    if (this.travelsChannel) {
      this.travelsChannel.unsubscribe();
      this.travelsChannel = null;
    }
    this.travelsLoaded.set(false);
    this.userTravels.set([]);
  }

  setCurrentTravel(travel: Travel | null): void {
    this.currentTravel.set(travel);
  }
}
