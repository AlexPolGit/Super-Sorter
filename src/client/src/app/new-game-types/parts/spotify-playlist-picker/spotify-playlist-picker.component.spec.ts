import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyPlaylistPickerComponent } from './spotify-playlist-picker.component';

describe('SpotifyPlaylistPickerComponent', () => {
  let component: SpotifyPlaylistPickerComponent;
  let fixture: ComponentFixture<SpotifyPlaylistPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyPlaylistPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyPlaylistPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
