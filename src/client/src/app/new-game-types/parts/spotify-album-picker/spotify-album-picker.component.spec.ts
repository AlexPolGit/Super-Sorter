import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyAlbumPickerComponent } from './spotify-album-picker.component';

describe('SpotifyAlbumPickerComponent', () => {
  let component: SpotifyAlbumPickerComponent;
  let fixture: ComponentFixture<SpotifyAlbumPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyAlbumPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyAlbumPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
