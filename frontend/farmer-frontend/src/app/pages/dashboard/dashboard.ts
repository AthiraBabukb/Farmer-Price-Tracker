import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Price } from '../../services/price';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  user: any = null;
  prices: any[] = [];
  isLoading = true;
  errorMessage = '';
  today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  constructor(
    private authService: Auth,
    private priceService: Price,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = this.authService.getUser();
    this.loadPrices();
  }

  loadPrices() {
    this.isLoading = true;
    this.priceService.getTodayPrices('', 'Kerala').subscribe({
      next: (response: any) => {
        this.prices = response.data.slice(0, 10);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load prices';
        this.isLoading = false;
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}