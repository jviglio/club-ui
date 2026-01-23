import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.loading = true;

    this.auth.login().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/home');
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message ?? 'Login falló';
      }
    });
  }
}
