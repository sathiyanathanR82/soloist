import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    }
  }

  loginWithSocial(provider: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Mock social login data
    const mockData = {
      email: `user.${provider.toLowerCase()}@example.com`,
      firstName: 'John',
      lastName: provider,
      profilePhoto: `https://ui-avatars.com/api/?name=John+${provider}&background=random`
    };

    this.authService.loginWithSocial(provider, mockData).subscribe({
      next: (response) => {
        if (response.success) {
          setTimeout(() => {
            this.router.navigate(['/registration']);
          }, 500);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
