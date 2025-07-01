import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  users$ = this.userService.users$;

  ngOnInit() {
    this.userService.getAll();
  }

  deleteUser(user: IUser) {
    this.userService.delete(user);
  }

  trackById(index: number, item: IUser) {
    return item.id;
  }
}
