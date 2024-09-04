import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
<<<<<<< HEAD
import { AdminService } from '../../../services/admin.service';
import { ImagePipe } from '../../../pipes/image.pipe';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
=======
>>>>>>> d71bfcf (Creating edit profile form)

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [RouterLink, ImagePipe, NavbarComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {

  user!: UserInfo;
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').username;
    this.adminService.getUserInformation(username).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        this.user = res.user;
      },
      error: (err: any) => {
        console.log('Error:', err);
      }
      });
  }
}

interface UserInfo {
  username: string;
  email: string;
  nit: string;
  imageProfile: string;
  isPreferCash: number;
  description: string;
}
