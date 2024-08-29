import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBillingComponent } from './store-billing.component';

describe('StoreBillingComponent', () => {
  let component: StoreBillingComponent;
  let fixture: ComponentFixture<StoreBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreBillingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
