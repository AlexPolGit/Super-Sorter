import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameComponent } from './new-game.component';

describe('NewGameComponent', () => {
  let component: NewGameComponent;
  let fixture: ComponentFixture<NewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
