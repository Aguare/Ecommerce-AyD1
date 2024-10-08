import { AfterViewInit, Component } from '@angular/core';

// Material
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';

// SplideJs
import Splide from '@splidejs/splide';



@Component({
  selector: 'app-prueba-material',
  standalone: true,
  imports: [MatDatepickerModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatDividerModule, MatCardModule],
  templateUrl: './prueba-material.component.html',
  styleUrl: './prueba-material.component.scss'
})
export class PruebaMaterialComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
      }).mount();
    }
  }

}
