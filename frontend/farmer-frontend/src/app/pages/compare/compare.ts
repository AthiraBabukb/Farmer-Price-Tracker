import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Price } from '../../services/price';

@Component({
  selector: 'app-compare',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './compare.html',
  styleUrl: './compare.scss'
})
export class Compare {

  selectedCrop = '';
  prices: any[] = [];
  isLoading = false;
  errorMessage = '';
  hasSearched = false;
  bestMarket: any = null;

  popularCrops = [
    'Banana', 'Coconut', 'Tomato', 'Onion',
    'Potato', 'Carrot', 'Cabbage', 'Beetroot'
  ];

  constructor(private priceService: Price) {}

  onCompare() {
    if (!this.selectedCrop) {
      this.errorMessage = 'Please enter a crop name';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;
    this.bestMarket = null;
    this.priceService.comparePrices(
      this.selectedCrop,
      'Kerala'
    ).subscribe({
      next: (response: any) => {
        this.prices = response.data;
        if (this.prices.length > 0) {
          this.bestMarket = this.prices.reduce((best, current) =>
            current.modalPrice > best.modalPrice ? current : best
          );
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to fetch comparison data';
        this.isLoading = false;
      }
    });
  }

  selectCrop(crop: string) {
    this.selectedCrop = crop;
    this.onCompare();
  }

  isBestMarket(price: any): boolean {
    return this.bestMarket &&
      price.market === this.bestMarket.market &&
      price.district === this.bestMarket.district;
  }
}