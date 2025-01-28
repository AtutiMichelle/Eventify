import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements AfterViewInit {

  constructor(private router : Router) {}
    navigateToPage(){
      this.router.navigate(['/register'])
    }

    scrollToSection(event: Event, sectionId: string) {
      event.preventDefault(); 
  
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 50, 
          behavior: 'smooth' 
        });
      }
  }

  ngAfterViewInit() {
    const featureCards = document.querySelectorAll('.feature-card'); // Select all cards
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 } // 30% visible
    );
    
    
    featureCards.forEach((card) => {
      observer.observe(card as Element); // Observe each feature card
    });
  }
  
  
    }

