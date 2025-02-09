import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ Ensures it's available globally
})
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`, {
      headers: this.getAuthHeaders(),
    });
  }

  getRegisteredEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-registrations`, {
      headers: this.getAuthHeaders(),
    });
  }
}
