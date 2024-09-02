import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
