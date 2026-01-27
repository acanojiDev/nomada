import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { RegisterComponent } from "./register-component/register-component";
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from './login-component/login-component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  isLoginMode = signal(true);
  authService = inject(Auth);
  router = inject(Router);

  destinations = [
    {
      id: 1,
      name: 'Bali, Indonesia',
      price: '$1,299',
      description: 'Tropical paradise with ancient temples',
      image: '/img/bali-indonesia.jpg'
    },
    {
      id: 2,
      name: 'Swiss Alps',
      price: '$2,499',
      description: 'Majestic peaks and crystal lakes',
      image: '/img/alpes-suizos.jpeg'
    },
    {
      id: 3,
      name: 'Kyoto, Japan',
      price: '$1,899',
      description: 'Timeless beauty and tradition',
      image: '/img/kyoto-japan.jpg'
    }
  ];

  features = [
    {
      icon: '◎',
      title: 'Expert Guidance',
      description: 'Our travel specialists craft personalized itineraries tailored to your dreams and preferences.'
    },
    {
      icon: '⚔',
      title: 'Safe & Secure',
      description: 'Travel with peace of mind knowing every detail is handled with care and precision.'
    },
    {
      icon: '♥',
      title: 'Authentic Experiences',
      description: 'Immerse yourself in local cultures with genuine, off-the-beaten-path adventures.'
    },
    {
      icon: '✦',
      title: 'Premium Quality',
      description: 'Handpicked accommodations and services that exceed expectations at every turn.'
    }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

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
      console.error('Error during login:', error.message);

      return;
    }

    if (data.user) {
      this.router.navigate(['/home']);
    }
  }

  toggleMode() {
    this.isLoginMode.update(value => !value);
  }
}
