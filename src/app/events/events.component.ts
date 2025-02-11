import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { response } from 'express';

@Component({
  selector: 'app-events',
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: any[] =[];
  errorMessage:string ='';

  constructor(private eventService:EventsService){}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(response=>{
      console.log('Events:',response);
      this.events=response;
    },
  
  )
  }
  

}
