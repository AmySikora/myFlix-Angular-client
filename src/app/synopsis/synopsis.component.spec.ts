import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsisComponent } from './synopsis.component';

describe('SynopsisComponent', () => {
  let component: SynopsisComponent;
  let fixture: ComponentFixture<SynopsisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SynopsisComponent]
    });
    fixture = TestBed.createComponent(SynopsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
