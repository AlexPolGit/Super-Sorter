import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSteamGamesComponent } from './new-steam-games.component';

describe('NewSteamGamesComponent', () => {
  let component: NewSteamGamesComponent;
  let fixture: ComponentFixture<NewSteamGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSteamGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSteamGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
