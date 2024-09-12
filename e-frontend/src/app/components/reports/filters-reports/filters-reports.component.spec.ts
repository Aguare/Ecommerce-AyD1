import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersReportsComponent } from './filters-reports.component';

describe('FiltersReportsComponent', () => {
  let component: FiltersReportsComponent;
  let fixture: ComponentFixture<FiltersReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
