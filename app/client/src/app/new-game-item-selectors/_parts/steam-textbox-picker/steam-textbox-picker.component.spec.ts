import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamTextboxPickerComponent } from './steam-textbox-picker.component';

describe('SteamTextboxPickerComponent', () => {
  let component: SteamTextboxPickerComponent;
  let fixture: ComponentFixture<SteamTextboxPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamTextboxPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamTextboxPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
