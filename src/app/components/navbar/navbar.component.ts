import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NetworkService } from '../../services/network.service';
import { CommonModule } from '@angular/common';
import { interval, delay, Subscription, startWith, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';

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
  public showMobileMenu = false;
  private pollingSubscription?: Subscription;
  private routerSubscription?: Subscription;

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
            startWith(0),
            switchMap(() => this.networkService.getNetworkInfo())
          );
        }
        return [];
      })
    ).subscribe();

    // Close mobile menu on route change
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showMobileMenu = false;
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
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
    this.showMobileMenu = false;
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
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

