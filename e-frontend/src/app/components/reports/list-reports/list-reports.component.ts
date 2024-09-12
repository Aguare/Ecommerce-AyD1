import { Component } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ReportsService } from '../../../services/reports.service';
import { FiltersReportsComponent } from '../filters-reports/filters-reports.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-list-reports',
  standalone: true,
  imports: [
    NavbarComponent,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss']
})
export class ListReportsComponent {
  reports: any = [];

  constructor(
    private _reportsService: ReportsService,
    private dialog: MatDialog
  ) {
    this._reportsService.getListReports({}).subscribe((res: any) => {
      this.reports = res;
    });
  }


  // Función para abrir el modal
  openDateRangeModal(report: any): void {
    const dialogRef = this.dialog.open(FiltersReportsComponent, {
      width: '400px',
      data: { report }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado con:', result);
    });
  }
}
