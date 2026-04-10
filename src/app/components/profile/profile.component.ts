import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  editMode = false;
  editForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  previewPhoto: string | null = null;
  selectedPhotoFile: File | null = null;
  showRestoreModal = false;
  showDeleteConfirmModal = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Handle OAuth redirect: reads ?token= from URL, fetches real user
    const urlParams = new URLSearchParams(window.location.search);
    const hasToken = urlParams.has('token');
    const isNewUser = urlParams.get('isNewUser') === 'true';

    if (hasToken) {
      this.isLoading = true;
      this.authService.handleAuthCallback().subscribe({
        next: (user) => {
          const userData = user?.data || user;
          this.currentUser = userData;
          this.initializeEditForm();
          this.isLoading = false;
          
          if (userData.deletion === true) {
            this.showRestoreModal = true;
          } else {
            // Redirect based on registration status
            if (userData.registerUser === true) {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/registration']);
            }
          }
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    // Normal page load: check if already authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const memUser = this.authService.getCurrentUser();
    this.currentUser = memUser?.data || memUser;

    // Subscribe to live user updates
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      if (this.currentUser && this.currentUser.deletion === true) {
        this.showRestoreModal = true;
      }
      
      // Only re-initialize if we are NOT currently in the middle of a save operation
      // to prevent synchronous infinite loops/redundant form resets.
      if (this.editMode && !this.isSaving) {
        this.initializeEditForm();
      }
    });

    // If no user in memory yet, fetch from backend
    if (!this.currentUser) {
      this.isLoading = true;
      this.authService.fetchCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user?.data || user;
          this.initializeEditForm();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.initializeEditForm();
    }
  }

  initializeEditForm(): void {
    this.editForm = this.fb.group({
      firstName: [this.currentUser?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [this.currentUser?.lastName || '', [Validators.required, Validators.minLength(2)]],
      phone: [this.currentUser?.phone || '', [Validators.pattern(/^[0-9\-\+\(\)\s]*$/)]],
      location: [this.currentUser?.location || ''],
      headline: [this.currentUser?.headline || ''],
      bio: [this.currentUser?.bio || '', Validators.maxLength(500)],
      website: [this.currentUser?.website || '', [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]],
      dateOfBirth: [this.formatDateForInput(this.currentUser?.dateOfBirth) || '', [Validators.required]],
      gender: [this.currentUser?.gender || ''],
      profileVisibility: [this.currentUser?.profileVisibility || 'All users'],
      emailVisibility: [this.currentUser?.emailVisibility || 'All users'],
      phoneVisibility: [this.currentUser?.phoneVisibility || 'All users'],
      showInNearbySearch: [this.currentUser?.showInNearbySearch !== undefined ? this.currentUser.showInNearbySearch : true]
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  saveChanges(): void {
    if (this.editForm.invalid) {
      this.errorMessage = 'Please fix the errors in your profile.';
      return;
    }

    this.isLoading = true;
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedData = { ...this.editForm.value };

    // Include profile photo if updated
    if (this.previewPhoto) {
      updatedData.profilePic = this.previewPhoto;
    }

    this.authService.updateUserProfile(updatedData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Profile updated successfully!';
          this.editMode = false;
          this.previewPhoto = null;
          this.selectedPhotoFile = null;

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Failed to update profile';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.isSaving = false;
        this.errorMessage = error.message || 'An error occurred while updating your profile.';
        console.error('Update error:', error);
      },
      complete: () => {
        this.isLoading = false;
        this.isSaving = false;
      }
    });
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewPhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.initializeEditForm();
    this.errorMessage = '';
  }

  confirmDeleteAccount(): void {
    this.showDeleteConfirmModal = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmModal = false;
  }

  deleteAccount(): void {
    if (!this.currentUser) return;
    const userId = this.currentUser.uid || this.currentUser.id || this.currentUser._id;
    
    this.isLoading = true;
    this.authService.deleteAccount(userId).subscribe({
      next: () => {
        // Assume authService.deleteAccount does clearSession() and redirect
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete account';
        this.isLoading = false;
        this.showDeleteConfirmModal = false;
      }
    });
  }

  restoreAccount(): void {
    this.isLoading = true;
    this.authService.updateUserProfile({ deletion: false }).subscribe({
      next: (response) => {
        if (response.success) {
          this.showRestoreModal = false;
          // After restore, redirect normally
          if (this.currentUser?.registerUser) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/registration']);
          }
        } else {
          this.errorMessage = response.message || 'Failed to restore account';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Error restoring account';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.errors['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field.errors['maxlength']) {
      return `${fieldName} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
    }
    if (field.errors['pattern']) {
      return `${fieldName} format is invalid`;
    }

    return 'Invalid input';
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'Not provided';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatDateForInput(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getProfileCompletion(): number {
    if (!this.currentUser) return 0;

    const fields = [
      'firstName', 'lastName', 'email', 'phone', 'location',
      'headline', 'bio', 'website', 'dateOfBirth', 'gender'
    ];

    const filledFields = fields.filter(field => {
      const value = this.currentUser[field];
      return value && value.toString().trim() !== '';
    }).length;

    return Math.round((filledFields / fields.length) * 100);
  }

  getInitials(): string {
    if (this.currentUser) {
      return (this.currentUser.firstName?.[0] || '') + (this.currentUser.lastName?.[0] || '');
    }
    return '';
  }

  public capitalizeFirstLetter(string: string | undefined): string {
    // Check if the string is empty or null for safety (optional chaining `?.` is a modern alternative)
    if (!string) return "";

    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
