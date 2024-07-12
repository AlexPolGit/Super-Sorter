import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnilistCharacterListComponent } from './anilist-character-list.component';

describe('AnilistCharacterListComponent', () => {
  let component: AnilistCharacterListComponent;
  let fixture: ComponentFixture<AnilistCharacterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnilistCharacterListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnilistCharacterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
