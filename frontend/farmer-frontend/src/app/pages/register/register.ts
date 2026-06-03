import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';        
import { FormsModule } from '@angular/forms';          
import { Router, RouterLink } from '@angular/router';  
import { Auth } from '../../services/auth';            

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],    
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  // NEW PROPERTIES
  name = '';
  email = '';
  password = '';
  phone = '';
  district = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  
  districts = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod'
  ];

  
  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  
  onRegister() {
    if (!this.name || !this.email || !this.password || !this.phone || !this.district) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      district: this.district
    }).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.authService.saveUser({
          _id: response._id,
          name: response.name,
          email: response.email,
          district: response.district
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.errorMessage = error.error.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }
}