import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEventDialogComponent } from './cancel-event-dialog.component';

describe('CancelEventDialogComponent', () => {
  let component: CancelEventDialogComponent;
  let fixture: ComponentFixture<CancelEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelEventDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
