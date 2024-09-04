import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {

  user = {
    username: 'John Doe',
    email: 'johndoe@email.com',
    address: '123 Street Name',
    nit: '123456789',
    imageProfile: 'https://via.placeholder.com/150',
    isPreferedCash: true,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc ne'
  };
  constructor() { }

  ngOnInit(): void {
  }
}
