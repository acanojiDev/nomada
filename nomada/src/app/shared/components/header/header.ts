import { Component, inject, signal, output, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Itinerary } from '../../../core/services/itinerary';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(Auth);
  private itineraryService = inject(Itinerary);
  private router = inject(Router);
  private document = inject(DOCUMENT);

  isMenuOpen = false;
  isSidebarOpen = signal(false);
  isDarkTheme = signal(false);

  // Acceso a signals de servicios
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  userTravels = this.itineraryService.userTravels;
  isLoadingTravels = this.itineraryService.isLoading;

  loginClick = output();
  registerClick = output();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme.set(true);
      this.document.documentElement.classList.add('dark');
    }
    effect(() => {
      if (this.isSidebarOpen() && this.isAuthenticated() && !this.itineraryService.travelsLoaded()) {
        this.loadTravels();
      }
    });
    effect(() => {
      if (this.isMenuOpen && this.isAuthenticated() && !this.itineraryService.travelsLoaded()) {
        this.loadTravels();
      }
    });
  }

  private loadTravels() {
    this.itineraryService.getAllTravels().subscribe();
  }

  toggleTheme() {
    this.isDarkTheme.update(val => !val);
    if (this.isDarkTheme()) {
      this.document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  goToItinerary(id: string) {
    this.closeSidebar();
    this.closeMenu();
    this.itineraryService.setCurrentTravelById(id);
    this.router.navigate(['/details']);
  }

  async logout() {
    const result = await this.authService.signOut();
    if (result.success) {
      this.itineraryService.unsubscribeFromTravels();
      this.closeSidebar();
      this.closeMenu();
      this.router.navigate(['/']);
    }
  }
}
