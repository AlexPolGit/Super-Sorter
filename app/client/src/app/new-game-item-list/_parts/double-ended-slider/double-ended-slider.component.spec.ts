import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleEndedSliderComponent } from './double-ended-slider.component';

describe('DoubleEndedSliderComponent', () => {
  let component: DoubleEndedSliderComponent;
  let fixture: ComponentFixture<DoubleEndedSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoubleEndedSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoubleEndedSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
