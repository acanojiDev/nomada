import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, computed, inject, effect } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Itinerary } from '../../../core/services/itinerary';


@Component({
  selector: 'app-ruta-generada',
  imports: [],
  templateUrl: './ruta-generada.html',
  styleUrl: './ruta-generada.scss',
})
export class RutaGenerada {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  map!: mapboxgl.Map;
  private itineraryService = inject(Itinerary);
  itinerario = this.itineraryService.currentTravel;
  itineraryData = computed(() => this.itinerario()?.itinerary);

  lat: number = 0;
  lng: number = 0;
  center: [number, number] = [0, 0];

  constructor() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b25pb2Nhbm8yMSIsImEiOiJjbWtlOXMyZjUwNG01M2ZzZnZ5Znp5a3pyIn0.ncuZ57WHTcURBFNHefqb8Q';

    effect(() => {
      const data = this.itineraryData();
      if (data?.days?.[0]?.places?.[0]?.coordinates) {
        this.lat = data.days[0].places[0].coordinates.lat;
        this.lng = data.days[0].places[0].coordinates.lng;
        this.center = [this.lng, this.lat];

        if (this.map) {
          this.map.flyTo({ center: this.center, zoom: 18 });
        }
      }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/antoniocano21/cmkwhtxao00at01s97l554ehu',
      zoom: 18,
      center: this.center,
      projection: 'globe'
    });

    this.map.on('style.load', () => {
      this.map.setFog({});
      this.map.addControl(new mapboxgl.NavigationControl());
    });
  }
}
