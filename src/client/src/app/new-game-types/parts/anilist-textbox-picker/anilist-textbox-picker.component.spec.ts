import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnilistTextboxPickerComponent } from './anilist-textbox-picker.component';

describe('AnilistTextboxPickerComponent', () => {
  let component: AnilistTextboxPickerComponent;
  let fixture: ComponentFixture<AnilistTextboxPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnilistTextboxPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnilistTextboxPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
