import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamFiledropPickerComponent } from './steam-filedrop-picker.component';

describe('SteamFiledropPickerComponent', () => {
  let component: SteamFiledropPickerComponent;
  let fixture: ComponentFixture<SteamFiledropPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamFiledropPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamFiledropPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
