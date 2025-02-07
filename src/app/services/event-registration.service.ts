import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {
  private apiUrl = 'http://localhost:5000/api'; // Base URL for API

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event-details`);
  }

  getTicketTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/ticket-types`);
  }

  getUserDetails(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl}/user`, { headers });
  }

  registerEvent(token: string, registrationData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/register-event`, registrationData, { headers });
  }
}
