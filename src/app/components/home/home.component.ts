import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NetworkService } from '../../services/network.service';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { interval, Subscription, startWith, switchMap } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  users: (User & { distance?: number })[] = [];
  currentUser: User | null = null;
  currentLat: number | null = null;
  currentLng: number | null = null;
  isLoading = true;
  errorMessage = '';
  pendingRequests: any[] = [];
  incomingRemovalRequests: any[] = [];
  private pollSubscription?: Subscription;

  showInvitePopup = false;
  selectedTargetUser: (User & { distance?: number }) | null = null;
  inviteForm!: FormGroup;


constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.inviteForm = this.fb.group({
      message: ['', Validators.maxLength(500)]
    });

    this.getLocation();
    this.startPolling();
  }


  ngOnDestroy(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  private startPolling(): void {
    // Poll for new data every 30 seconds to keep the list synced
    this.pollSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.authService.isAuthenticated$)
      )
      .subscribe(isAuth => {
        if (isAuth) {
          this.loadUsers();
        }
      });
  }

  // Connection State Helpers
  isConnected(user: User): boolean {
    const targetUid = user.uid || user.id;
    return !!this.currentUser?.network?.myNetwork?.includes(targetUid!);
  }

  isPending(user: User): boolean {
    const myUid = this.currentUser?.uid || this.currentUser?.id;
    return !!user.network?.request?.some((req: any) => req.userId === myUid);
  }

  isRemovalPending(user: User): boolean {
    const myUid = this.currentUser?.uid || this.currentUser?.id;
    return !!user.network?.removalRequest?.some((req: any) => req.userId === myUid);
  }

  toggleNetwork(user: User): void {
    const targetId = user.uid;
    if (!targetId) return;

    if (this.isConnected(user)) {
      if (this.isRemovalPending(user)) {
        // Option to cancel the removal request if supported (not explicitly requested, but good UX)
        // For now, just show a message.
        alert('A removal request has already been sent and is awaiting approval.');
        return;
      }

      if (confirm(`Request to remove ${user.firstName} from your network? This will require their approval.`)) {
        this.networkService.removeConnection(targetId).subscribe({
          next: () => this.refreshData(),
          error: (err) => console.error('Failed to request network removal:', err)
        });
      }
    } else if (this.isPending(user)) {
      this.networkService.cancelRequest(targetId).subscribe({
        next: () => this.refreshData(),
        error: (err) => console.error('Failed to cancel request:', err)
      });
    } else {
      this.networkService.sendRequest(targetId).subscribe({
        next: () => this.refreshData(),
        error: (err) => console.error('Failed to send request:', err)
      });
    }
  }

  // Request Action Handlers
  approveRequest(requesterId: string): void {
    this.networkService.approveRequest(requesterId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to approve request:', err)
    });
  }

  rejectRequest(requesterId: string): void {
    this.networkService.rejectRequest(requesterId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to reject request:', err)
    });
  }

  approveRemoval(requesterId: string): void {
    this.networkService.approveRemoval(requesterId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to approve removal:', err)
    });
  }

  rejectRemoval(requesterId: string): void {
    this.networkService.rejectRemoval(requesterId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to reject removal:', err)
    });
  }

  getLastSeen(user: User): string {
    if (user.isOnline) return 'Online now';
    if (!user.lastLogin) return 'Active recently';

    const lastLogin = new Date(user.lastLogin);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastLogin.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `Active ${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `Active ${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return 'Active yesterday';
    
    return `Active ${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  private refreshData(): void {
    this.authService.fetchCurrentUser().subscribe(user => {
      // this.currentUser = user;
      this.loadUsers();
    });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.currentLat = position.coords.latitude;
            this.currentLng = position.coords.longitude;

            if (this.currentLat !== null && this.currentLat !== undefined &&
              this.currentLng !== null && this.currentLng !== undefined) {
              this.authService.updateUserProfile({
                latitude: this.currentLat,
                longitude: this.currentLng
              }).subscribe({
                next: () => { },
                error: (err) => { }
              });
            }

            this.loadUsers();
          });
        },
        (error) => {
          this.ngZone.run(() => {
            console.error('Error getting location:', error);
            this.errorMessage = 'Unable to get your location. Displaying users alphabetically.';
            this.loadUsers();
          });
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (response: any) => {
        let allUsers = Array.isArray(response) ? response : (response?.data || response?.users || response?.user || []);

        if (!Array.isArray(allUsers)) {
          allUsers = [];
        }

        const filteredUsers = allUsers.filter((u: any) => {
          const myUid = this.currentUser?.uid;
          // const myId = this.currentUser?.id || (this.currentUser as any)?._id;
          // const myEmail = this.currentUser?.email;

          const matchUid = (u.uid && u.uid === myUid) || (u._id && u._id === myUid);
          // const matchId = (u.id && u.id === myId) || (u._id && u._id === myId);
          // const matchEmail = u.email && u.email === myEmail;

          const isMe = matchUid;
          const isRegistered = u.registerUser === true;
          const isVisible = u.showInNearbySearch !== false; // Default to true if not set

          return u && typeof u === 'object' && isRegistered && !isMe && isVisible;
        });

        this.users = filteredUsers.map((user: User) => {
          if (!user || typeof user !== 'object') return null;

          const hasLat = user.latitude !== null && user.latitude !== undefined;
          const hasLng = user.longitude !== null && user.longitude !== undefined;

          if (this.currentLat !== null && this.currentLng !== null && hasLat && hasLng) {
            const distance = this.calculateDistance(
              this.currentLat,
              this.currentLng,
              Number(user.latitude),
              Number(user.longitude)
            );
            return { ...user, distance: isNaN(distance) ? undefined : distance };
          }
          return user;
        }).filter((u: any) => u !== null) as (User & { distance?: number })[];

        this.users.sort((a, b) => {
          const distA = a.distance;
          const distB = b.distance;

          if (distA !== undefined && distB !== undefined) {
            return distA - distB;
          }

          if (distA !== undefined) return -1;
          if (distB !== undefined) return 1;

          const nameA = a.firstName || a.lastName || '';
          const nameB = b.firstName || b.lastName || '';
          return nameA.localeCompare(nameB);
        });

        this.isLoading = false;
        this.cdr.detectChanges();

        // Fetch pending requests for the current user
        this.networkService.getNetworkInfo().subscribe({
          next: (info: any) => {
            if (info.success) {
              this.pendingRequests = info.data.requests || [];
              this.incomingRemovalRequests = info.data.removalRequests || [];
              this.cdr.detectChanges();
            }
          }
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage = 'Failed to load users. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getInitials(user: User): string {
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  }

  formatDistance(dist: number | undefined): string {
    if (dist === undefined) return 'Location unknown';
    if (dist < 1) return `${Math.round(dist * 1000)} m away`;
    return `${dist.toFixed(1)} km away`;
  }

  logout(): void {
    this.authService.logout();
  }
}
