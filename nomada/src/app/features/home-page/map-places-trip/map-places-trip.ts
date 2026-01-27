import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-map-places-trip',
  templateUrl: './map-places-trip.html',
  styleUrls: ['./map-places-trip.scss']
})
export class MapPlacesTrip implements OnInit, AfterViewInit, OnDestroy {
  map!: mapboxgl.Map;

  ngOnInit(): void {
    console.log('MapComponent initialized');
  }

  ngAfterViewInit(): void {
    console.log('Initializing map...');
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b25pb2Nhbm8yMSIsImEiOiJjbWtlOXMyZjUwNG01M2ZzZnZ5Znp5a3pyIn0.ncuZ57WHTcURBFNHefqb8Q';

    try {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 12,
      });

      this.map.on('load', () => {
        console.log('Map loaded successfully!');
      });

      this.map.on('error', (e) => {
        console.error('Map error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
