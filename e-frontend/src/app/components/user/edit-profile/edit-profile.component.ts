import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

  editProfileForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
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
}
