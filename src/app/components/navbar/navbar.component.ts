import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NetworkService } from '../../services/network.service';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { interval, delay, takeWhile, Subscription, startWith, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated$ = this.authService.isAuthenticated$.pipe(delay(0));
  currentUser$ = this.authService.currentUser$.pipe(delay(0));
  networkRequestsCount$ = this.networkService.networkRequestsCount$;
  private pollingSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private networkService: NetworkService
  ) { }

  ngOnInit(): void {
    // Poll for new network requests every 30 seconds when authenticated
    this.pollingSubscription = this.authService.isAuthenticated$.pipe(
      switchMap(isAuth => {
        if (isAuth) {
          return interval(30000).pipe(
            startWith(0), // Trigger immediately on login
            switchMap(() => this.networkService.getNetworkInfo())
          );
        }
        return [];
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  goToNetwork(): void {
    this.router.navigate(['/network']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToMessages(): void {
    this.router.navigate(['/messages']);
  }


  goToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitials(user: any): string {
    if (user) {
      const first = user.firstName?.[0] || '';
      const last = user.lastName?.[0] || '';
      return (first + last).toUpperCase();
    }
    return '';
  }


  public capitalizeFirstLetter(string: string | undefined): string {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
