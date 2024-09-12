import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filters-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './filters-reports.component.html',
  styleUrl: './filters-reports.component.scss'
})
export class FiltersReportsComponent {
  dateRangeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FiltersReportsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.dateRangeForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }


  onClose(): void {
    this.dialogRef.close(this.dateRangeForm.value);
  }
}
