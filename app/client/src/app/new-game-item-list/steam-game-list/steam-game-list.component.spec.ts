import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamGameListComponent } from './steam-game-list.component';

describe('SteamGameListComponent', () => {
  let component: SteamGameListComponent;
  let fixture: ComponentFixture<SteamGameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamGameListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
