import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { RegisterComponent } from "./register-component/register-component";
import { Router } from '@angular/router';
import { LoginComponent } from './login-component/login-component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [RegisterComponent, LoginComponent],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  authService = inject(Auth);
  router = inject(Router);

  async handleRegister(credentials: { email: string; password: string; username: string }) {
    const { data, error } = await this.authService.signUp(
      credentials.email,
      credentials.password,
      credentials.username
    );

    if (error) {
      console.error('Error during registration:', error);
      return;
    }

    if (data.user) {
      this.router.navigate(['/']);
    }
  }

  async handleLogin(credentials: { email: string; password: string }) {
    const { data, error } = await this.authService.signIn(
      credentials.email,
      credentials.password
    );
    if (error) {
      console.error('Error during login:', error);
      return;
    }

    if (data.user) {
      this.router.navigate(['/']);
    }
  }
}
