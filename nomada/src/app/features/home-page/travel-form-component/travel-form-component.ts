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
import { RouterLink } from "@angular/router";

const SUGGESTED_INTERESTS = [
  { name: "Historia", emoji: "🏛️" },
  { name: "Arte", emoji: "🎨" },
  { name: "Gastronomía", emoji: "🍽️" },
  { name: "Naturaleza", emoji: "🌿" },
  { name: "Arquitectura", emoji: "🏰" },
  { name: "Museos", emoji: "🖼️" },
  { name: "Vida nocturna", emoji: "🌙" },
  { name: "Compras", emoji: "🛍️" },
  { name: "Aventura", emoji: "⛰️" },
  { name: "Relax", emoji: "🧘" },
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
    days: number;
    interests: string[];
  }>();

  suggestedInterests = SUGGESTED_INTERESTS;

  constructor(private fb: FormBuilder) {
    this.travelForm = this.fb.group({
      about: ['', Validators.required],
      budget: [''],
      days: [1, [Validators.required, Validators.min(1)]],
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
    this.cities.markAsTouched();
  }

  toggleInterest(interest: string): void {
    const index = this.interests.value.indexOf(interest);
    if (index > -1) {
      this.interests.removeAt(index);
      this.interests.markAsTouched();
    } else if (this.interests.length < 3) {
      this.interests.push(new FormControl(interest));
      this.interests.markAsTouched();
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
      const { about, budget, days } = this.travelForm.value;
      this.submitForm.emit({
        about,
        budget,
        days: Number(days),
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

  get about() {
    return this.travelForm.get('about');
  }

  get budget() {
    return this.travelForm.get('budget');
  }

  get days() {
    return this.travelForm.get('days');
  }

  get destination() {
    return this.travelForm.get('destinationInput');
  }
}
