import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IUser } from '../interfaces';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';

  private usersSubject = new BehaviorSubject<IUser[]>([]);
  users$ = this.usersSubject.asObservable();

  public search: ISearch = {
    page: 1,
    size: 5
  };
  public totalItems: number[] = [];

  constructor(private alertService: AlertService) {
    super();
  }

  getAll() {
    console.log('GET ALL USERS: page', this.search.page, 'size', this.search.size);
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('RESPONSE FROM getAll:', response);
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        // Ajusta según cómo responde tu backend
        if (response.data) {
          this.usersSubject.next(response.data);
        } else {
          this.usersSubject.next(response);
        }
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  save(user: IUser) {
    console.log('SAVING USER:', user);
    this.add(user).subscribe({
      next: (response: any) => {
        console.log('SAVE RESPONSE:', response);
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err) => {
        console.error('Error adding user', err);
        this.alertService.displayAlert('error', 'An error occurred adding the user', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  update(user: IUser) {
    console.log('UPDATING USER:', user);
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        console.log('UPDATE RESPONSE:', response);
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err) => {
        console.error('Error updating user', err);
        this.alertService.displayAlert('error', 'An error occurred updating the user', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  delete(user: IUser) {
    console.log('DELETING USER:', user);
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        console.log('DELETE RESPONSE:', response);
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err) => {
        console.error('Error deleting user', err);
        this.alertService.displayAlert('error', 'An error occurred deleting the user', 'center', 'top', ['error-snackbar']);
      }
    });
  }
}
