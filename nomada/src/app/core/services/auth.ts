import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public supabase: SupabaseClient;
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

  mapSupabaseAuthError(error: any): string {
    switch (error?.message) {
      case 'Invalid login credentials':
        return 'Email o contraseña incorrectos';
      case 'Email not confirmed':
        return 'Debes confirmar tu email antes de iniciar sesión';
      case 'Too many requests':
        return 'Demasiados intentos. Inténtalo más tarde';
      case 'User is banned':
        return 'Tu cuenta ha sido deshabilitada';
      case 'User already registered':
        return 'Este email ya está registrado';
      default:
        return 'Ha ocurrido un error inesperado. Inténtalo de nuevo';
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return {
          data: null,
          error: {
            raw: error,
            message: this.mapSupabaseAuthError(error),
          },
        };
      }
      if (data.user) {
        this.currentUser.set(data.user);
        this.isAuthenticated.set(true);
      }
      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: {
          raw: err,
          message: 'Error de conexión. Revisa tu internet',
        },
      };
    }
  }

  async signUp(email: string, password: string, username: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      if (error) {
        return {
          data: null,
          error: {
            raw: error,
            message: this.mapSupabaseAuthError(error),
          },
        };
      }
      if (data.user) {
        this.currentUser.set(data.user);
        this.isAuthenticated.set(true);
      }
      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: {
          raw: err,
          message: 'Error de conexión. Revisa tu internet',
        },
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
