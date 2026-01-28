import { Component, inject, signal, output  } from '@angular/core';
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

  isMenuOpen = false;
  isSidebarOpen = signal(false);

  // Acceso a signals de servicios
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  userTravels = this.itineraryService.userTravels;

  loginClick = output();
  registerClick = output();

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
    this.router.navigate(['/itinerary', id]);
  }

  async logout() {
    const result = await this.authService.signOut();
    if (result.success) {
      this.closeSidebar();
      this.closeMenu();
      this.router.navigate(['/']);
    }
  }
}
