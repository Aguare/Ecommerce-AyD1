import { Component } from '@angular/core';

// Material
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-prueba-material',
  standalone: true,
  imports: [MatDatepickerModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatDividerModule, MatCardModule],
  templateUrl: './prueba-material.component.html',
  styleUrl: './prueba-material.component.scss'
})
export class PruebaMaterialComponent {

}
