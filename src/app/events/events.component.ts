import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from '../services/core.service';
import { response } from 'express';

@Component({
  selector: 'app-events',
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {

  isScrolled = false;

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
  events: any[] =[];
  errorMessage:string ='';

  constructor(private coreService:CoreService){}

  ngOnInit() {
    this.coreService.getEvents().subscribe(
      response => {
        console.log('✅ Events:', response);
        this.events = response;
      },
      error => {
        console.error('❌ Error fetching events:', error);
        this.errorMessage = 'Failed to load events.';
      }
    );
  }
  
}
  
