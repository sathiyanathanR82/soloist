import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService, private router: Router) {}

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
          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;
          this.loadUsers();
        },
        (error) => {
          console.error('Error getting location:', error);
          this.errorMessage = 'Unable to get your location. Displaying users alphabetically.';
          this.loadUsers(); // Load users anyway, but won't be sorted by distance
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
        const allUsers = Array.isArray(response) ? response : (response?.data || response?.users || response?.user || []);
        console.log('Processed allUsers:', allUsers);
        
        if (Array.isArray(allUsers)) {
          // Filter users who are registered and not the current user
          let filteredUsers = allUsers.filter(u => u.registerUser === true && (u.uid !== this.currentUser?.uid && u.id !== this.currentUser?.id));
          
          // Fallback: If no users have registerUser=true, but we have users in DB, use them for display (maybe they were just added)
          if (filteredUsers.length === 0 && allUsers.length > 0) {
             console.warn('No users with registerUser=true found. Showing all users as fallback.');
             filteredUsers = allUsers.filter(u => u.uid !== this.currentUser?.uid && u.id !== this.currentUser?.id);
          }

          this.users = filteredUsers.map(user => {
              if (this.currentLat !== null && this.currentLng !== null && user.latitude && user.longitude) {
                const distance = this.calculateDistance(
                  this.currentLat,
                  this.currentLng,
                  user.latitude,
                  user.longitude
                );
                return { ...user, distance };
              }
              return user;
            });

          // Sort by distance if available, otherwise by name
          this.users.sort((a, b) => {
            if (a.distance !== undefined && b.distance !== undefined) {
              return a.distance - b.distance;
            }
            if (a.distance !== undefined) return -1;
            if (b.distance !== undefined) return 1;
            return (a.firstName || '').localeCompare(b.firstName || '');
          });
        } else {
          console.warn('Expected array of users, got:', allUsers);
          this.users = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage = 'Failed to load users. Please try again later.';
        this.isLoading = false;
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
