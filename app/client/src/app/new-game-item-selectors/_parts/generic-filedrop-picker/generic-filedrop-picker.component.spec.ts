import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFiledropPickerComponent } from './generic-filedrop-picker.component';

describe('GenericFiledropPickerComponent', () => {
  let component: GenericFiledropPickerComponent;
  let fixture: ComponentFixture<GenericFiledropPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFiledropPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericFiledropPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
