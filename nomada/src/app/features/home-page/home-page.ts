import { Component } from '@angular/core';
import { TravelFormComponent } from './travel-form-component/travel-form-component';

@Component({
  selector: 'app-home-page',
  imports: [TravelFormComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

}
