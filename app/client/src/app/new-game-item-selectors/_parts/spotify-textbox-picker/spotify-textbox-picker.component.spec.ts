import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyTextboxPickerComponent } from './spotify-textbox-picker.component';

describe('SpotifyTextboxPickerComponent', () => {
  let component: SpotifyTextboxPickerComponent;
  let fixture: ComponentFixture<SpotifyTextboxPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyTextboxPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyTextboxPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
