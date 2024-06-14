import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnilistMediaComponent } from './new-anilist-media.component';

describe('NewAnilistMediaComponent', () => {
  let component: NewAnilistMediaComponent;
  let fixture: ComponentFixture<NewAnilistMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnilistMediaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAnilistMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
