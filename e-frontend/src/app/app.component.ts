import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PruebaMaterialComponent } from "./prueba-material/prueba-material.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PruebaMaterialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'e-frontend';
}
