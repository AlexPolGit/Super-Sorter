import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnilistFiledropPickerComponent } from './anilist-filedrop-picker.component';

describe('AnilistFiledropPickerComponent', () => {
  let component: AnilistFiledropPickerComponent;
  let fixture: ComponentFixture<AnilistFiledropPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnilistFiledropPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnilistFiledropPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
