import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  private apiUrl='http://127.0.0.1:5000/api';

  constructor(private http:HttpClient) { }

  //auth
  private getAuthHeaders(){
    const token = localStorage.getItem('auth_token');
    return {
      headers:new HttpHeaders({
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

  //user-dashboard
  getUserDetails():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/user`, this.getAuthHeaders());
  }

  getRegisteredEvents():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/user-registrations`, this.getAuthHeaders());
  }

  logout ():void {
    localStorage.removeItem('auth_token');
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event-details`);
  }

  getTicketTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/ticket-types`);
  }

  registerEvent(token: string, registrationData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/register-event`, registrationData, { headers });
  }

  //admin dashboard
  getDashboardStats():Observable<any>{
    return this.http.get(`${this.apiUrl}/admin/dashboard-stats`);
    
  }

  getRecentUsers():Observable<any>{
    return this.http.get(`${this.apiUrl}/admin/recent-users`);
  }

  getAllUsers():Observable<any>{
    return this.http.get(`${this.apiUrl}/admin/all-users`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => new Error('Error fetching users'));
      })
    );
  }
//search querries
  searchUsers(query: string): Observable<any> {
    console.log('🔍 Searching for:', query); // Debugging log
  
    return this.http.get<any>(`${this.apiUrl}/admin/search-users?search=${query}`).pipe(
      catchError((error) => {
        console.error('❌ API error:', error);
        return throwError(() => new Error('Error searching users'));
      })
    );
  }
  searchEvents(query: string): Observable<any> {
    console.log('🔍 Searching for:', query); // Debugging log
  
    return this.http.get<any>(`${this.apiUrl}/search-events?search=${query}`).pipe(
      catchError((error) => {
        console.error('❌ API error:', error);
        return throwError(() => new Error('Error searching events'));
      })
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}`, userData);
  }

  createEvent(eventData:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/events`,eventData);
  }

  updateEvent(id: number, eventData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/events/${id}`, eventData);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/events/${id}`);
  }

  getEventRegistrations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event-registrations`);
  }

  searchEventRegistrations(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event-registrations/search?query=${query}`);
  }

  updateEventRegistration(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/event-registrations/${id}`, updatedData);
  }

  deleteEventRegistration(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/event-registrations/${id}`);
  }

  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }

  getTicketSalesDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/ticket-sales-distribution`);
  }

  getCancelledEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/cancelled-events`);
  }

  getCanceledRegistrations() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/canceled-registrations`);
}


  cancelRegistration(id: number, reason: string) {
    return this.http.post<any>(`${this.apiUrl}/admin/cancel-registration`, { id, reason });
}

  
}