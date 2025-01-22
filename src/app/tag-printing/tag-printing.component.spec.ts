import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPrintingComponent } from './tag-printing.component';

describe('TagPrintingComponent', () => {
  let component: TagPrintingComponent;
  let fixture: ComponentFixture<TagPrintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagPrintingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
