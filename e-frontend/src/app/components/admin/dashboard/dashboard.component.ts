import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';
import { ProductService } from '../../../services/product.service';
import { NavbarComponent } from "../../commons/navbar/navbar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isBrowser?: boolean;

  barChartOptions = {
    responsive: true,
  };
  barChartLabels : any = [];
  barChartData : any= [];
  
  barChartOptions1 = {
    responsive: true,
  };
  barChartLabels1:any = [];
  barChartData1:any = [];

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    

    this.productService.getProducsWithMoreSales().subscribe({
      next: (res: any) => {
        console.log(res.report3);

        const rep3 = this.dataArray(res.report3);
        console.log(rep3);
        
        this.doughnutChartData = {
          labels: rep3.namesArray,
          datasets: [{ data: rep3.dataArray }],
        };

        const {sales, names} = this.divideArray(res.report1);
        this.barChartLabels = names;
        this.barChartData = [{
          data: sales,
          label: 'Productos mas vendidos',
        }]
        
        const rep2 = this.divideArray(res.report2);
        this.barChartLabels1 = rep2.names;
        this.barChartData1 = [{
          data: rep2.sales,
          label: 'Productos con mas stock',
        }]
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  divideArray(products: any[]) {
    const sales: number[] = [];
    const names: string[] = [];

    products.forEach((product) => {
      sales.push(Number(product.sales));
      names.push(product.name);
    });

    return { sales, names };
  }

  dataArray(array: any) {
    let namesArray : any= [];
    let dataArray :any= [];

    array.forEach((item:any) => {
        namesArray.push(item.name);
        
        if (item.quantity && item.quantity.data) {
            dataArray.push(item.quantity.data[0]); 
        }
    });

    return { namesArray, dataArray };
}



  

  lineChartOptions = {
    responsive: true,
  };
  lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  lineChartData = [
    { data: [500, 600, 800, 700, 900, 1000], label: 'Ventas 2024' },
    { data: [450, 500, 700, 650, 850, 950], label: 'Ventas 2023' },
  ];
}
