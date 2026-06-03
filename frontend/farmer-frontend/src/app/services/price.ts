import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class Price {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: Auth
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTodayPrices(crop?: string, state?: string): Observable<any> {
    let url = `${this.apiUrl}/prices/today?state=${state || 'Kerala'}`;
    if (crop) url += `&crop=${crop}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  comparePrices(crop: string, state?: string): Observable<any> {
    let url = `${this.apiUrl}/prices/compare?crop=${crop}`;
    if (state) url += `&state=${state}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getPriceHistory(crop: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/prices/history/${crop}`,
      { headers: this.getHeaders() }
    );
  }
}