import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-store-config',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './store-config.component.html',
  styleUrl: './store-config.component.scss'
})
export class StoreConfigComponent implements OnInit{

  companyForm :FormGroup;

  constructor(private fb:FormBuilder){
    this.companyForm = this.fb.group({
      addressCompany: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', [Validators.required, Validators.minLength(3)]],
      postalCode: ['', [Validators.required, Validators.minLength(5)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    
  }  

  onSubmit() {
    if (this.companyForm.valid) {
      console.log(this.companyForm.value);
    } else {
      console.log("El formulario no es valido")
    }
  }

}
