import { Component } from '@angular/core';
import { ItinerarioCreado } from "./itinerario-creado/itinerario-creado";

@Component({
  selector: 'app-details-page',
  imports: [ItinerarioCreado],
  templateUrl: './details-page.html',
  styleUrl: './details-page.scss',
})
export class DetailsPage {

}
