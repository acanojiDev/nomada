import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PasswordValidators } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-register-component',
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;

  registerSubmit = output<{ email: string; password: string; username: string }>();

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6), PasswordValidators.hasUpperCase(), PasswordValidators.hasNumber()]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: PasswordValidators.passwordMatch('password', 'confirmPassword')
      }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, username } = this.registerForm.value;
      this.registerSubmit.emit({ email, password, username });
    }
  }

  // Getters for form controls for easier access in the template
  get email() {
    return this.registerForm.get('email');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
