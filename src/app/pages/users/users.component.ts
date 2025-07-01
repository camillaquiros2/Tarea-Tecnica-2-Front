import { Component, inject, ViewChild } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserFormComponent } from '../../components/user/user-from/user-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    UserFormComponent,
    AsyncPipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public userService: UserService = inject(UserService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addUsersModal') public addUsersModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  userForm = this.fb.group({
    id: [''],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', Validators.required],
    updatedAt: ['', Validators.required],
  });

  constructor() {
    const role = localStorage.getItem('role');
    if (role !== 'SUPER_ADMIN') {
      // Si no es SUPER_ADMIN, redirige a /products
      window.location.href = '/products';
    }

    this.userService.search.page = 1;
    this.userService.getAll();
  }

  saveUser(user: IUser) {
    this.userService.save(user);
    this.modalService.closeAll();
  }

  callEdition(user: IUser) {
    this.userForm.patchValue({
      id: user.id ? String(user.id) : '',
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      password: user.password,
      updatedAt: user.updatedAt
    });
    this.modalService.displayModal('md', this.addUsersModal);
  }

  updateUser(user: IUser) {
    this.userService.update(user);
    this.modalService.closeAll();
  }
}
