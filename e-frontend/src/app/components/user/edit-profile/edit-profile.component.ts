import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

  editProfileForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private adminService: AdminService) {
    this.editProfileForm = this.formBuilder.group({
      address: [''],
      nit: [''],
      description: [''],
      isPreferedCash: [false],
      image: [' ', [Validators.required]],

    });
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editProfileForm.get('image')?.setValue(file);
    }
  }

  goHome() {
    this.router.navigate(['/products/init']);
  }

  updateProfile() {
    const formData = new FormData();
    formData.append('address', this.editProfileForm.get('address')?.value);
    formData.append('nit', this.editProfileForm.get('nit')?.value);
    formData.append('description', this.editProfileForm.get('description')?.value);
    formData.append('isPreferedCash', this.editProfileForm.get('isPreferedCash')?.value);
    formData.append('image', this.editProfileForm.get('image')?.value);

    this.adminService.updateUserInformation(formData, 1).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/products/init']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
