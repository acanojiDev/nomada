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
  private markers: mapboxgl.Marker[] = [];
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
      if (data && this.map) {
        if (data.days?.[0]?.places?.[0]?.coordinates) {
          const firstCoord = data.days[0].places[0].coordinates;
          if (firstCoord.lat !== 0 && firstCoord.lng !== 0) {
            this.center = [firstCoord.lng, firstCoord.lat];
            this.map.flyTo({ center: this.center, zoom: 18 });
          }
        }

        if (this.map.loaded()) {
          this.addRouteAndMarkers(data);
        } else {
          this.map.once('load', () => this.addRouteAndMarkers(data));
        }
      }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    const data = this.itineraryData();
    if (data?.days?.[0]?.places?.[0]?.coordinates) {
      const firstCoord = data.days[0].places[0].coordinates;
      this.center = [firstCoord.lng, firstCoord.lat];
    }

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
      const data = this.itineraryData();
      if (data) {
        this.addRouteAndMarkers(data);
      }
    });
  }

  private addRouteAndMarkers(data: any) {
    if (!data?.days) return;
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    const coordinates: [number, number][] = [];

    data.days.forEach((day: any) => {
      day.places.forEach((place: any) => {
        if (place.coordinates &&
          place.coordinates.lat !== 0 &&
          place.coordinates.lng !== 0) {
          const coord: [number, number] = [place.coordinates.lng, place.coordinates.lat];
          coordinates.push(coord);

          const marker = new mapboxgl.Marker({
            color: '#ff6b35',
            scale: 0.8
          })
            .setLngLat(coord)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 5px; font-family: 'Outfit', sans-serif;">
                  <h4 style="margin: 0; color: #121212;">${place.name}</h4>
                  <p style="margin: 5px 0 0; color: #525252; font-size: 0.8rem;">${place.visit_time}</p>
                </div>
              `))
            .addTo(this.map);
          this.markers.push(marker);
        }
      });
    });

    if (coordinates.length > 0) {
      if (this.map.getSource('route')) {
        (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        });
      } else {
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#00d9ff',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      }
    }
  }
}
