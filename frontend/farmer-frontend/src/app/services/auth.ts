import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';    
import { Observable } from 'rxjs';                    
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;                

  constructor(private http: HttpClient) {}            

  //  calls register API
  register(data: any): Observable<any> {              
    return this.http.post(`${this.apiUrl}/auth/register`, data); 
  }                                                   

  // calls login API
  login(data: any): Observable<any> {                 
    return this.http.post(`${this.apiUrl}/auth/login`, data); 
  }                                                   

  // saves token in browser
  saveToken(token: string): void {                    
    localStorage.setItem('token', token);             
  }                                                   

  // saves user data in browser
  saveUser(user: any): void {                         
    localStorage.setItem('user', JSON.stringify(user)); 
  }                                                   

  // gets token from browser
  getToken(): string | null {                         
    return localStorage.getItem('token');             
  }                                                   

  // gets user from browser
  getUser(): any {                                    
    const user = localStorage.getItem('user');        
    return user ? JSON.parse(user) : null;            
  }                                                   

  //  checks if farmer is logged in
  isLoggedIn(): boolean {                             
    return !!this.getToken();                         
  }                                                   

  //  clears browser storage on logout
  logout(): void {                                    
    localStorage.removeItem('token');                 
    localStorage.removeItem('user');                  
  }                                                  
  
}
