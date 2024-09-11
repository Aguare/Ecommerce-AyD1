import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit{

  isBrowser?: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  barChartOptions = {
    responsive: true,
  };
  barChartLabels = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  barChartData = [
    { data: [150, 200, 180, 220, 210, 230, 190], label: 'Ventas en los ultimos 7 dias' },
  ];

  public doughnutChartLabels: string[] = [
    'Agotados',
    'Baja Disponibilidad',
    'En Stock',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [30, 50, 120] }],
  };
  public doughnutChartType: ChartType = 'doughnut';

  lineChartOptions = {
    responsive: true,
  };
  lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  lineChartData = [
    { data: [500, 600, 800, 700, 900, 1000], label: 'Ventas 2024' },
    { data: [450, 500, 700, 650, 850, 950], label: 'Ventas 2023' },
  ];
  
}
