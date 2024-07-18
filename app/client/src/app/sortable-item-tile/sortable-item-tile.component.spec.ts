import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortableItemTileComponent } from './sortable-item-tile.component';

describe('SortableItemTileComponent', () => {
  let component: SortableItemTileComponent;
  let fixture: ComponentFixture<SortableItemTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableItemTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SortableItemTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
