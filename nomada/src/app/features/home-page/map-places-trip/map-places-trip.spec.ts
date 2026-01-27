import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlacesTrip } from './map-places-trip';

describe('MapPlacesTrip', () => {
  let component: MapPlacesTrip;
  let fixture: ComponentFixture<MapPlacesTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPlacesTrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPlacesTrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
