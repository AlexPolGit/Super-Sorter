import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericItemListComponent } from './generic-item-list.component';

describe('GenericItemListComponent', () => {
  let component: GenericItemListComponent;
  let fixture: ComponentFixture<GenericItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericItemListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
