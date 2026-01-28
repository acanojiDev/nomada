import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Itinerary } from '../../../core/services/itinerary';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule, ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-itinerario-creado',
  imports: [CommonModule, AccordionModule, AvatarModule, BadgeModule, ProgressSpinner],
  templateUrl: './itinerario-creado.html',
  styleUrl: './itinerario-creado.scss',
})
export class ItinerarioCreado {
  private itineraryService = inject(Itinerary);
  itinerario = this.itineraryService.currentTravel;
  itineraryData = computed(() => this.itinerario()?.itinerary);

  constructor() {console.log(this.itineraryData) }
}
