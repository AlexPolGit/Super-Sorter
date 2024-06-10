import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnilistAnimeComponent } from './new-anilist-anime.component';

describe('NewAnilistAnimeComponent', () => {
  let component: NewAnilistAnimeComponent;
  let fixture: ComponentFixture<NewAnilistAnimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnilistAnimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAnilistAnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
