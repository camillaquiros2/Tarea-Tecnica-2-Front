import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginError!: string;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: (response: any) => {
          console.log('LOGIN RESPONSE:', response);

          if (response?.authUser?.role?.name) {
            localStorage.setItem('role', response.authUser.role.name);
            localStorage.setItem('email', response.authUser.email);
            console.log(`Role guardado en localStorage: ${response.authUser.role.name}`);
          } else {
            console.warn('No se encontró role.name en la respuesta');
          }

          this.router.navigateByUrl('/app/dashboard');
        },
        error: (err: any) => {
          console.error('LOGIN ERROR:', err);
          this.loginError = err.error?.description || 'Login failed';
        },
      });
    }
  }
}
