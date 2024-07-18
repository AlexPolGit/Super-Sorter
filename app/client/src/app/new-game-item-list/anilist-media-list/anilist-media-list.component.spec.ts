import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnilistMediaListComponent } from './anilist-media-list.component';

describe('AnilistMediaListComponent', () => {
  let component: AnilistMediaListComponent;
  let fixture: ComponentFixture<AnilistMediaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnilistMediaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnilistMediaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
