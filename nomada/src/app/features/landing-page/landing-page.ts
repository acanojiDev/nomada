import { Component, ElementRef, viewChild } from '@angular/core';
import { Hero } from "./hero/hero";
import { ItineraryPreview } from "./itinerary-preview/itinerary-preview";
import { PopularDestinations } from "./popular-destinations/popular-destinations";
import { IdeaToItinerary } from "./idea-to-itinerary/idea-to-itinerary";
import { Testimonials } from "./testimonials/testimonials";
import { Footer } from "./footer/footer";
import { LoginComponent } from '../auth-page/login-component/login-component';
import { RegisterComponent } from '../auth-page/register-component/register-component';

@Component({
  selector: 'app-landing-page',
  imports: [Hero, ItineraryPreview, PopularDestinations, IdeaToItinerary, Testimonials, Footer, LoginComponent, RegisterComponent],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  loginDialog = viewChild<ElementRef<HTMLDialogElement>>('loginDialog');
  registerDialog = viewChild<ElementRef<HTMLDialogElement>>('registerDialog');

  openLogin() {
    this.loginDialog()?.nativeElement.showModal();
  }

  closeLogin() {
    this.loginDialog()?.nativeElement.close();
  }

  openRegister() {
    this.registerDialog()?.nativeElement.showModal();
  }

  closeRegister() {
    this.registerDialog()?.nativeElement.close();
  }
}
