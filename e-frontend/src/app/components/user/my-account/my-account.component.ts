import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ImagePipe } from '../../../pipes/image.pipe';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [RouterLink, ImagePipe, NavbarComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {

  user: UserInfo = {
    username: '',
    email: '',
    nit: '',
    imageProfile: '',
    isPreferCash: 0,
    description: ''
  };
  constructor(private adminService: AdminService, private localStorageService: LocalStorageService, private router: Router) { }

  ngOnInit(): void {
    const username = this.localStorageService.getUserName();
    if (!username) {
      this.router.navigate(['/']);
      return;
    }
    this.adminService.getUserInformation(username).subscribe({
      next: (res: any) => {
        this.user = res.user;
      },
      error: (err: any) => {
        this.user.imageProfile = this.localStorageService.getUserPhoto();
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
