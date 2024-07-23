import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearSeasonRangeComponent } from './year-season-range.component';

describe('YearSeasonRangeComponent', () => {
  let component: YearSeasonRangeComponent;
  let fixture: ComponentFixture<YearSeasonRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearSeasonRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearSeasonRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
