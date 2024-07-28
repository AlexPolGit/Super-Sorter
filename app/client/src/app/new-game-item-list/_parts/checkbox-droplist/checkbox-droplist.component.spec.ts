import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxDroplistComponent } from './checkbox-droplist.component';

describe('CheckboxDroplistComponent', () => {
  let component: CheckboxDroplistComponent;
  let fixture: ComponentFixture<CheckboxDroplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxDroplistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxDroplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
