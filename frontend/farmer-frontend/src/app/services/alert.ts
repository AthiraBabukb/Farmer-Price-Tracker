import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class Alert {

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

  createAlert(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/alerts`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getMyAlerts(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/alerts`,
      { headers: this.getHeaders() }
    );
  }

  deleteAlert(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/alerts/${id}`,
      { headers: this.getHeaders() }
    );
  }
}