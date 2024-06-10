import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSpotifySongsComponent } from './new-spotify-songs.component';

describe('NewSpotifySongsComponent', () => {
  let component: NewSpotifySongsComponent;
  let fixture: ComponentFixture<NewSpotifySongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSpotifySongsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSpotifySongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
