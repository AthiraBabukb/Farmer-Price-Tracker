import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Price } from '../../services/price';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {

  searchCrop = '';
  selectedState = 'Kerala';
  prices: any[] = [];
  isLoading = false;
  errorMessage = '';
  hasSearched = false;

  popularCrops = [
    'Banana', 'Coconut', 'Tomato', 'Onion',
    'Potato', 'Carrot', 'Cabbage', 'Beetroot',
    'Brinjal', 'Bitter gourd', 'Pumpkin', 'Tapioca'
  ];

  constructor(private priceService: Price) {}

  onSearch() {
    if (!this.searchCrop) {
      this.errorMessage = 'Please enter a crop name';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;
    this.priceService.getTodayPrices(
      this.searchCrop,
      this.selectedState
    ).subscribe({
      next: (response: any) => {
        this.prices = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to fetch prices';
        this.isLoading = false;
      }
    });
  }

  selectCrop(crop: string) {
    this.searchCrop = crop;
    this.onSearch();
  }
}