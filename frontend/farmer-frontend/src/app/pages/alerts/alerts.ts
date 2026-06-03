import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss'
})
export class Alerts implements OnInit {

  crop = '';
  market = '';
  targetPrice: number | null = null;
  myAlerts: any[] = [];
  isLoading = false;
  isCreating = false;
  errorMessage = '';
  successMessage = '';

  popularCrops = [
    'Banana', 'Coconut', 'Tomato', 'Onion',
    'Potato', 'Carrot', 'Cabbage', 'Beetroot',
    'Brinjal', 'Bitter gourd', 'Pumpkin', 'Tapioca'
  ];

  constructor(private alertService: Alert) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.isLoading = true;
    this.alertService.getMyAlerts().subscribe({
      next: (response: any) => {
        this.myAlerts = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onCreateAlert() {
    if (!this.crop || !this.market || !this.targetPrice) {
      this.errorMessage = 'Please fill all fields';
      return;
    }
    this.isCreating = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.alertService.createAlert({
      crop: this.crop,
      market: this.market,
      targetPrice: this.targetPrice
    }).subscribe({
      next: () => {
        this.successMessage = 'Alert created successfully!';
        this.crop = '';
        this.market = '';
        this.targetPrice = null;
        this.isCreating = false;
        this.loadAlerts();
      },
      error: (error: any) => {
        this.errorMessage = error.error.message || 'Failed to create alert';
        this.isCreating = false;
      }
    });
  }

  onDeleteAlert(id: string) {
    this.alertService.deleteAlert(id).subscribe({
      next: () => {
        this.myAlerts = this.myAlerts.filter(a => a._id !== id);
      },
      error: () => {
        this.errorMessage = 'Failed to delete alert';
      }
    });
  }
}