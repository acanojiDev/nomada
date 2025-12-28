import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { RegisterComponent } from "./register-component/register-component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  authService = inject(Auth);

  async handleRegister(credentials: { email: string; password: string; username: string }) {
    try {
      const { error } = await this.authService.signUp(
        credentials.email,
        credentials.password,
        credentials.username
      );
      
      if (error) {
        console.error('Error during sign up:', error);
        return;
      }
      
    } catch (error: any) {
      console.error('Unexpected error during sign up:', error);
    }
  }
}
