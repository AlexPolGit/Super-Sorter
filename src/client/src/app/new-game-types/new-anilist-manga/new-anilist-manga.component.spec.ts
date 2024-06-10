import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnilistMangaComponent } from './new-anilist-manga.component';

describe('NewAnilistMangaComponent', () => {
  let component: NewAnilistMangaComponent;
  let fixture: ComponentFixture<NewAnilistMangaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnilistMangaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAnilistMangaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
