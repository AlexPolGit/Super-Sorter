import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGenericItemComponent } from './new-generic-item.component';

describe('NewGenericItemComponent', () => {
  let component: NewGenericItemComponent;
  let fixture: ComponentFixture<NewGenericItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGenericItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewGenericItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
