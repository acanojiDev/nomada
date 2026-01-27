import { Component, inject, computed, signal } from '@angular/core';
import { Itinerary } from '../../../core/services/itinerary';

@Component({
  selector: 'app-itinerario-creado',
  imports: [],
  templateUrl: './itinerario-creado.html',
  styleUrl: './itinerario-creado.scss',
})
export class ItinerarioCreado {
  private itineraryService = inject(Itinerary);
  itinerario = this.itineraryService.currentTravel;
  itineraryData = computed(() => this.itinerario()?.itinerary);
  expandedDay = signal<number | null>(1);

  toggleDay(day: number): void {
    this.expandedDay.update((current: number | null) => current === day ? null : day);
  }

  constructor() { }
}
