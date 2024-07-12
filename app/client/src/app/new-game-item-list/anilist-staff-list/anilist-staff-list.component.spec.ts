import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnilistStaffListComponent } from './anilist-staff-list.component';

describe('AnilistStaffListComponent', () => {
  let component: AnilistStaffListComponent;
  let fixture: ComponentFixture<AnilistStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnilistStaffListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnilistStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
