import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      })
    };
  }

  login(loginData: { name: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  signup(signupData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, signupData);
  }

  fetchUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`, this.getAuthHeaders());
  }
}
