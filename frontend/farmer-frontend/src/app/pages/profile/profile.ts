import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  user: any = null;
  name = '';
  phone = '';
  district = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta',
    'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam',
    'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode',
    'Wayanad', 'Kannur', 'Kasaragod'
  ];

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = this.authService.getUser();
    this.name = this.user?.name || '';
    this.phone = this.user?.phone || '';
    this.district = this.user?.district || '';
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}