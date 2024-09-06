import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SettingTabsComponent } from '../setting-tabs/setting-tabs.component';
import { NavbarComponent } from '../../../commons/navbar/navbar.component';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SettingTabsComponent, NavbarComponent],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss'
})
export class GeneralSettingsComponent implements OnInit{
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
