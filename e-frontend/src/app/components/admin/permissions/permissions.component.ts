import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AdminService } from '../../../services/admin.service';
import { Role } from '../../../interfaces';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent implements OnInit {

  roleForm!: FormGroup;
  roles: Role[] = [];
  isUpdating = false;
  currentRoleId = 0;
  currentPermissionsRoleId = 0;
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

    this._adminService.getRoles().subscribe((data: any) => {
      this.roles = data.data;
    }, error => {
      this.roles = [];
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

  deleteRole(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // this._adminService.deleteRole(id).subscribe((data: any) => {
        //   Swal.fire('Deleted!', 'The role has been deleted.', 'success');
        //   this.roles = this.roles.filter(role => role.id !== id);
        // }, error => {
        //   Swal.fire('Error!', 'An error occurred while deleting the role.', 'error');
        // });
      }
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

  updatePermissionsWithRole(roleId: number) {
    this.currentPermissionsRoleId = roleId;
  }
}
