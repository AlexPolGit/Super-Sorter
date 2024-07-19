import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyFiledropPickerComponent } from './spotify-filedrop-picker.component';

describe('SpotifyFiledropPickerComponent', () => {
  let component: SpotifyFiledropPickerComponent;
  let fixture: ComponentFixture<SpotifyFiledropPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyFiledropPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyFiledropPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
