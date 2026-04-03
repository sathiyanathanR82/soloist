import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { delay } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class NavbarComponent {
  showUserMenu = false;
  isAuthenticated$ = this.authService.isAuthenticated$.pipe(delay(0));
  currentUser$ = this.authService.currentUser$.pipe(delay(0));

  constructor(private authService: AuthService, private router: Router) {}

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.showUserMenu = false;
  }

  goToHome(): void {
    this.router.navigate(['/home']);
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showUserMenu = false;
  }

  getInitials(user: any): string {
    if (user) {
      const first = user.firstName?.[0] || '';
      const last = user.lastName?.[0] || '';
      return (first + last).toUpperCase();
    }
    return '';
  }
}
