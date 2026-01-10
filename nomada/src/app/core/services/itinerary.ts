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

  // Signals
  currentTravel = signal<Travel | null>(null);
  userTravels = signal<Travel[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

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
          .single()
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
              }
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

    this.isLoading.set(true);
    this.error.set(null);

    return new Observable<Travel[]>((observer) => {
      from(
        this.supabase
          .from(this.TABLE_NAME)
          .select('*')
          .eq('userInfo', user.id)
          .order('created_at', { ascending: false })
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
          this.isLoading.set(false);
          observer.next(data as Travel[]);
          observer.complete();
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
          observer.error(err);
        },
      });
    });
  }

  setCurrentTravel(travel: Travel | null): void {
    this.currentTravel.set(travel);
  }
}
