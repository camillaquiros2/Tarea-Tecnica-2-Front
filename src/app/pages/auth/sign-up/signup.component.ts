import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignUpComponent {
  public signUpError = '';
  public validSignup = false;

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public user: Partial<IUser> = {
    name: '',
    lastname: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public handleSignup(event: Event) {
    event.preventDefault();

    // Marca campos como tocados si no son válidos
    [this.nameModel, this.lastnameModel, this.emailModel, this.passwordModel].forEach(model => {
      if (!model.valid) model.control.markAsTouched();
    });

    // Si todos son válidos, envía signup
    if (this.nameModel.valid && this.lastnameModel.valid && this.emailModel.valid && this.passwordModel.valid) {
      this.authService.signup(this.user).subscribe({
        next: () => {
          this.validSignup = true;
          this.signUpError = '';
          console.log('User registered successfully');
          setTimeout(() => this.router.navigateByUrl('/login'), 2000);
        },
        error: (err: any) => {
          console.error('SIGNUP ERROR:', err);
          this.signUpError = err.error?.description || err.error?.message || 'Registration failed';
        }
      });
    }
  }
}
