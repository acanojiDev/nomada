import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { RegisterComponent } from "./register-component/register-component";
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from './login-component/login-component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {

}
