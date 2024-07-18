import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDeselectComponentComponent } from './select-deselect-component.component';

describe('SelectDeselectComponentComponent', () => {
  let component: SelectDeselectComponentComponent;
  let fixture: ComponentFixture<SelectDeselectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDeselectComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDeselectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
