import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: (User & { distance?: number })[] = [];
  currentUser: User | null = null;
  currentLat: number | null = null;
  currentLng: number | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
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

    this.getLocation();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.currentLat = position.coords.latitude;
            this.currentLng = position.coords.longitude;

            // Persist location to backend each time the user lands here (covers "each login")
            if (this.currentLat !== null && this.currentLat !== undefined &&
              this.currentLng !== null && this.currentLng !== undefined) {
              this.authService.updateUserProfile({
                latitude: this.currentLat,
                longitude: this.currentLng
              }).subscribe({
                next: () => { },//console.log('Location synced to backend'),
                error: (err) => { } //console.error('Failed to sync location:', err)
              });
            } else {
              console.warn('Location available but coordinates are invalid. Skipping sync.');
            }

            this.loadUsers();
          });
        },
        (error) => {
          this.ngZone.run(() => {
            console.error('Error getting location:', error);
            this.errorMessage = 'Unable to get your location. Displaying users alphabetically.';
            this.loadUsers(); // Load users anyway, but won't be sorted by distance
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
        // Extract users from various possible response structures
        let allUsers = Array.isArray(response) ? response : (response?.data || response?.users || response?.user || []);

        // Ensure allUsers is an array and filter out non-object entries (security/integrity check)
        if (!Array.isArray(allUsers)) {
          console.warn('Expected array of users, but got:', typeof allUsers, allUsers);
          allUsers = [];
        }

        // Filter users who are registered and not the current user, with strict null checks
        let filteredUsers = allUsers.filter((u: User) => {
          const isMe = (u.uid && u.uid === this.currentUser?.uid) || (u.id && u.id === this.currentUser?.id);
          const isRegistered = u.registerUser === true;

          // if (isMe) console.log('Filtered out (Self):', u.firstName || u.uid || u.id);

          return u && typeof u === 'object' && isRegistered && !isMe;
        });

        // Fallback: If no users have registerUser=true, but we have users in DB, use them for display
        if (filteredUsers.length === 0 && allUsers.length > 0) {
          console.warn('No users with registerUser=true found. Showing all users as fallback.');
          filteredUsers = allUsers.filter((u: User) => {
            const isMe = (u.uid && u.uid === this.currentUser?.uid) || (u.id && u.id === this.currentUser?.id);
            return u && typeof u === 'object' && !isMe;
          });
        }

        // console.log('Final filteredUsers:', filteredUsers);

        this.users = filteredUsers.map((user: User) => {
          // Extra safety check for the user object itself
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

        // Sort by distance if available, otherwise by name
        this.users.sort((a, b) => {
          // If both have distance, sort by it
          const distA = a.distance;
          const distB = b.distance;

          if (distA !== undefined && distB !== undefined) {
            return distA - distB;
          }

          // Push users with unknown location to the end
          if (distA !== undefined) return -1;
          if (distB !== undefined) return 1;

          // Secondary sort by name
          const nameA = a.firstName || a.lastName || '';
          const nameB = b.firstName || b.lastName || '';
          return nameA.localeCompare(nameB);
        });

        this.isLoading = false;
        this.cdr.detectChanges();
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
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
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
