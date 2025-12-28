import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data.user) {
      this.currentUser.set(data.user);
    }
    return { data, error };
  }

  async signUp(email: string, password: string, username: string) {
    return await this.supabase.auth.signUp({ email, password, options: { data: { username } } });
  }
}
