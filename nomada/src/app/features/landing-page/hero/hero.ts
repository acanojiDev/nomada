import { Component } from '@angular/core';
import { Header } from "../../../shared/components/header/header";

@Component({
  selector: 'app-hero',
  imports: [Header],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
