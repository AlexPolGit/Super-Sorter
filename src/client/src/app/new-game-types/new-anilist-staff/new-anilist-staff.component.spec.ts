import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnilistStaffComponent } from './new-anilist-staff.component';

describe('NewAnilistStaffComponent', () => {
  let component: NewAnilistStaffComponent;
  let fixture: ComponentFixture<NewAnilistStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnilistStaffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAnilistStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
