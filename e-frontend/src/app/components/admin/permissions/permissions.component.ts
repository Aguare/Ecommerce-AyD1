import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AdminService } from '../../../services/admin.service';
import { Role, RolePage } from '../../../interfaces';
import Swal from 'sweetalert2';
import e from 'express';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent implements OnInit {

  roleForm!: FormGroup;
  pagesForm!: FormGroup;
  roles: Role[] = [];
  isUpdating = false;
  currentRoleId = 0;
  currentPermissionsRoleId = 0;
  pages: RolePage[] = [];
  currentPages: RolePage[] = [];
  constructor(
    private _localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private _adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })

    this.pagesForm = this.fb.group({
      pages: this.fb.array([])
    });

    this._adminService.getRoles().subscribe((data: any) => {
      this.roles = data.data;
    }, error => {
      this.roles = [];
    });

    this._adminService.getAllRolePages().subscribe((data: any) => {
      this.pages = data.data;
      this.pages.forEach(page => {
        (this.pagesForm.get('pages') as FormArray).push(new FormControl(false));
      });
    }, error => {
      this.pages = [];
    });
  }

  submit() {
    if (this.roleForm.invalid) {
      Swal.fire('Error!', 'Por favor llene los campos del formulario.', 'error');
      return;
    }

    const { name, description } = this.roleForm.value;
    if (this.isUpdating) {
      this.updateRole(name, description);
    } else {
      this.saveRole(name, description);
    }
  }

  saveRole(name: string, description: string) {
    this._adminService.addRole(name, description).subscribe((data: any) => {
      Swal.fire('Creado', 'El rol ha sido creado.', 'success');
      window.location.reload();
    }, error => {
      Swal.fire('Error!', 'Un error ha ocurrido al crear el nuevo rol.', 'error');
    });
  }

  updateRole(name: string, description: string) {
    if (this.currentRoleId === 0) {
      Swal.fire('Error!', 'No se ha seleccionado un rol para actualizar.', 'error');
      return;
    }
    
    this._adminService.updateRole(name, description, this.currentRoleId).subscribe((data: any) => {
      Swal.fire('Actualizado', 'El rol ha sido actualizado.', 'success');
      window.location.reload();
    }, error => {
      Swal.fire('Error!', 'Un error ha ocurrido al actualizar el rol.', 'error');
    });
  }

  editRole(role: Role) {
    this.roleForm.setValue({
      name: role.name,
      description: role.description
    });

    this.isUpdating = true;
    this.currentRoleId = role.id;
  }

  cancelUpdate() {
    this.roleForm.reset();
    this.isUpdating = false;
    this.currentRoleId = 0;
  }

  chooseRolePages(roleId: number) {
    this.currentPermissionsRoleId = roleId;
    const rolePages = this.roles[this.currentPermissionsRoleId - 1].pages;
    // update new form array with currentRoleId permissions
    (this.pagesForm.get('pages') as FormArray).controls.forEach((control, index) => {
      control.setValue(rolePages.some(page => page.id === this.pages[index].id));
    });
  }

  updatePages() {
    if (this.currentPermissionsRoleId === 0) {
      Swal.fire('Error!', 'No se ha seleccionado un rol para actualizar.', 'error');
      return;
    }

    const pages = this.pagesForm.value.pages;
    const rolePages = this.pages.filter((page, index) => pages[index]);
    // this._adminService.updateRolePages(this.currentPermissionsRoleId, rolePages).subscribe((data: any) => {
    //   Swal.fire('Actualizado', 'Los permisos del rol han sido actualizados.', 'success');
    // }, error => {
    //   Swal.fire('Error!', 'Un error ha ocurrido al actualizar los permisos del rol.', 'error');
    // });
    this._adminService.updateRolePages(this.currentPermissionsRoleId, rolePages).subscribe((data: any) => {
      Swal.fire('Actualizado', 'Los permisos del rol han sido actualizados.', 'success');
      window.location.reload();
    }, error => {
      Swal.fire('Error!', 'Un error ha ocurrido al actualizar los permisos del rol.', 'error');
      console.log(error);
    });
  }
}
