import { Component } from '@angular/core';
import { Hero } from "./hero/hero";
import { ItineraryPreview } from "./itinerary-preview/itinerary-preview";
import { PopularDestinations } from "./popular-destinations/popular-destinations";
import { IdeaToItinerary } from "./idea-to-itinerary/idea-to-itinerary";
import { Testimonials } from "./testimonials/testimonials";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-landing-page',
  imports: [Hero, ItineraryPreview, PopularDestinations, IdeaToItinerary, Testimonials, Footer],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {

}
