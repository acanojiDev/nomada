import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { minLengthArray } from '../../../shared/validators/arrayLength.validator';

const SUGGESTED_INTERESTS = [
  'Historia',
  'Arte',
  'Gastronomía',
  'Naturaleza',
  'Arquitectura',
  'Museos',
  'Vida nocturna',
  'Compras',
  'Aventura',
  'Relax',
];

@Component({
  selector: 'app-travel-form-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './travel-form-component.html',
  styleUrl: './travel-form-component.scss',
  standalone: true,
})
export class TravelFormComponent {
  isLoading = input(false);
  travelForm: FormGroup;
  submitForm = output<{
    about: string;
    cities: string[];
    budget: string;
    interests: string[];
  }>();

  suggestedInterests = SUGGESTED_INTERESTS;

  constructor(private fb: FormBuilder) {
    this.travelForm = this.fb.group({
      about: ['', Validators.required],
      budget: [''],
      destinationInput: ['', []],
      cities: this.fb.array([], minLengthArray(1)),
      interests: this.fb.array([], minLengthArray(1)),
    });
  }

  addDestination(): void {
    const destControl = this.travelForm.get('destinationInput')!;
    if (destControl.valid && !this.cities.value.includes(destControl.value)) {
      this.cities.push(new FormControl(destControl.value));
      destControl.setValue('');
      destControl.markAsPristine();
    }
  }

  removeDestination(index: number): void {
    this.cities.removeAt(index);
  }

  toggleInterest(interest: string): void {
    const index = this.interests.value.indexOf(interest);
    if (index > -1) {
      this.interests.removeAt(index);
    } else if (this.interests.length < 3) {
      this.interests.push(new FormControl(interest));
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addDestination();
    }
  }

  onSubmit(): void {
    if (this.travelForm.valid && this.cities.length > 0) {
      console.log(this.travelForm.value);
      const { about, budget } = this.travelForm.value;
      this.submitForm.emit({
        about: about,
        budget,
        cities: this.cities.value,
        interests: this.interests.value,
      });
    }
  }

  get cities(): FormArray {
    return this.travelForm.get('cities') as FormArray;
  }

  get interests(): FormArray {
    return this.travelForm.get('interests') as FormArray;
  }

  get query() {
    return this.travelForm.get('query');
  }

  get budget() {
    return this.travelForm.get('budget');
  }

  get destination() {
    return this.travelForm.get('destinationInput');
  }
}
