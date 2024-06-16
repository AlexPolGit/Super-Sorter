import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSessionComponent } from './import-session.component';

describe('NewAnilistCharacterComponent', () => {
  let component: ImportSessionComponent;
  let fixture: ComponentFixture<ImportSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
