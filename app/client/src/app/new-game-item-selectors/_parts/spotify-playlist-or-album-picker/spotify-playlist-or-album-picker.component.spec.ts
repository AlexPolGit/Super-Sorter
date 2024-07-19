import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyPlaylistOrAlbumPickerComponent } from './spotify-playlist-or-album-picker.component';

describe('SpotifyPlaylistOrAlbumPickerComponent', () => {
  let component: SpotifyPlaylistOrAlbumPickerComponent;
  let fixture: ComponentFixture<SpotifyPlaylistOrAlbumPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyPlaylistOrAlbumPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyPlaylistOrAlbumPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
