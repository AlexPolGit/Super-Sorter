import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipDroplistComponent } from './chip-droplist.component';

describe('ChipDroplistComponent', () => {
  let component: ChipDroplistComponent;
  let fixture: ComponentFixture<ChipDroplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipDroplistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipDroplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
