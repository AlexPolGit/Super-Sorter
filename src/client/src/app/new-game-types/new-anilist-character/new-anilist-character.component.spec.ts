import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnilistCharacterComponent } from './new-anilist-character.component';

describe('NewAnilistCharacterComponent', () => {
  let component: NewAnilistCharacterComponent;
  let fixture: ComponentFixture<NewAnilistCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnilistCharacterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAnilistCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
