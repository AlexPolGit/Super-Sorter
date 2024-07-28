import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamLibraryPickerComponent } from './steam-library-picker.component';

describe('SteamLibraryPickerComponent', () => {
  let component: SteamLibraryPickerComponent;
  let fixture: ComponentFixture<SteamLibraryPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamLibraryPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamLibraryPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
