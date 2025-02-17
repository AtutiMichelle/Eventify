import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDEventsComponent } from './crud-events.component';

describe('CRUDEventsComponent', () => {
  let component: CRUDEventsComponent;
  let fixture: ComponentFixture<CRUDEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRUDEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRUDEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
