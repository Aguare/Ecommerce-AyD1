import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppereanceSettingsComponent } from './appereance-settings.component';

describe('AppereanceSettingsComponent', () => {
  let component: AppereanceSettingsComponent;
  let fixture: ComponentFixture<AppereanceSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppereanceSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppereanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
