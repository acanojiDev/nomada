import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
    this.checkSession();

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.currentUser.set(session.user);
        this.isAuthenticated.set(true);
      } else {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
    });
  }

  async checkSession() {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();

      if (error) {
        console.error('Error al verificar sesión:', error);
        return;
      }

      if (session?.user) {
        this.currentUser.set(session.user);
        this.isAuthenticated.set(true);
      }
    } catch (err) {
      console.error('Error inesperado al verificar sesión:', err);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        return { data: null, error };
      }

      if (data.user) {
        this.currentUser.set(data.user);
        this.isAuthenticated.set(true);
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Catch error in signIn:', err);
      return {
        data: null,
        error: { message: err.message || 'Error desconocido' },
      };
    }
  }

  async signUp(email: string, password: string, username: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        console.error('Supabase auth error:', error);
        return { data: null, error };
      }
      if (data.user) {
        this.currentUser.set(data.user);
        this.isAuthenticated.set(true);
      }
      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err.message || 'Error desconocido' },
      };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        console.error('Error al cerrar sesión:', error);
        return { success: false, error };
      }

      this.currentUser.set(null);
      this.isAuthenticated.set(false);

      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error inesperado al cerrar sesión:', err);
      return { success: false, error: err };
    }
  }
}
