import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnilistFavePickerComponent } from './anilist-fave-picker.component';

describe('AnilistFavePickerComponent', () => {
  let component: AnilistFavePickerComponent;
  let fixture: ComponentFixture<AnilistFavePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnilistFavePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnilistFavePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
