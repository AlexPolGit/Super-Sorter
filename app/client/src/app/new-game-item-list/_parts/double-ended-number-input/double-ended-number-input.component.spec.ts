import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleEndedNumberInputComponent } from './double-ended-number-input.component';

describe('DoubleEndedNumberInputComponent', () => {
  let component: DoubleEndedNumberInputComponent;
  let fixture: ComponentFixture<DoubleEndedNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoubleEndedNumberInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoubleEndedNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
