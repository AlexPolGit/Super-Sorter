import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGridComponent } from './checkbox-grid.component';

describe('CheckboxGridComponent', () => {
  let component: CheckboxGridComponent;
  let fixture: ComponentFixture<CheckboxGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
