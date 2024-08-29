import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-store-billing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './store-billing.component.html',
  styleUrl: './store-billing.component.scss'
})
export class StoreBillingComponent implements OnInit{

  companyForm :FormGroup;

  constructor(private fb:FormBuilder){
    this.companyForm = this.fb.group({
      nameCompany: ['', [Validators.required, Validators.minLength(3)]],
      image: [' ', [Validators.required]]
    });
  }

  ngOnInit(): void {
    
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.companyForm.get('image')?.setValue(file);
    }
  }
  

  onSubmit() {
    if (this.companyForm.valid) {
      console.log(this.companyForm.value);
    } else {
      console.log("El formulario no es valido")
    }
  } 
}
