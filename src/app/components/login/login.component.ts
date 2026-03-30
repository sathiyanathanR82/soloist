import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  socialProviders = [
    {
      name: 'Facebook',
      icon: '👍',
      color: '#1877F2',
      className: 'facebook'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0A66C2',
      className: 'linkedin'
    },
    {
      name: 'Gmail',
      icon: '✉️',
      color: '#DC3545',
      className: 'gmail'
    },
    {
      name: 'Yahoo',
      icon: '📧',
      color: '#7B0099',
      className: 'yahoo'
    },
    {
      name: 'Microsoft',
      icon: '⊞',
      color: '#0078D4',
      className: 'microsoft'
    }
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // If already logged in, skip straight to registration
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/registration']);
    }
  }

  /**
   * Redirects the browser to the backend OAuth endpoint.
   * The OAuth flow happens server-side; on success the backend
   * redirects back to /profile?token=<jwt>.
   */
  loginWithSocial(provider: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    // No return — browser navigates away entirely
    this.authService.loginWithSocial(provider);
  }
}
