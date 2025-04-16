import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSmartFormsComponent } from './ngx-smart-forms.component';

describe('NgxSmartFormsComponent', () => {
  let component: NgxSmartFormsComponent;
  let fixture: ComponentFixture<NgxSmartFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSmartFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSmartFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
