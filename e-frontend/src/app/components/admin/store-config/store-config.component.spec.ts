import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreConfigComponent } from './store-config.component';

describe('StoreConfigComponent', () => {
  let component: StoreConfigComponent;
  let fixture: ComponentFixture<StoreConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
