import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEventRegistrationsComponent } from './crud-event-registrations.component';

describe('CrudEventRegistrationsComponent', () => {
  let component: CrudEventRegistrationsComponent;
  let fixture: ComponentFixture<CrudEventRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudEventRegistrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudEventRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
