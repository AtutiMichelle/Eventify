import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private apiUrl= 'http://127.0.0.1:5000/api';

  constructor(private http:HttpClient) { }

  getEvents():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/events`);
  }
}
