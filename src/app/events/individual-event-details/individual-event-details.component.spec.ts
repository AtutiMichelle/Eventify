import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualEventDetailsComponent } from './individual-event-details.component';

describe('IndividualEventDetailsComponent', () => {
  let component: IndividualEventDetailsComponent;
  let fixture: ComponentFixture<IndividualEventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualEventDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
