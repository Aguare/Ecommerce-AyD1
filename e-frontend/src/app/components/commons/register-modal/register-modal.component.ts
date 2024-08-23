import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent {
  @Input() title_: string = '';
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>(); 

  onClose() {
    this.closeModal.emit();
  }
}
