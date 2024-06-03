import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPageComponent } from './top-page.component';

describe('TopPageComponent', () => {
  let component: TopPageComponent;
  let fixture: ComponentFixture<TopPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
