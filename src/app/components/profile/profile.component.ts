import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  editMode = false;
  editForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.editMode) {
        this.initializeEditForm();
      }
    });

    this.initializeEditForm();
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
      dateOfBirth: [this.currentUser?.dateOfBirth || ''],
      gender: [this.currentUser?.gender || '']
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
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateUserProfile(this.editForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Profile updated successfully!';
          this.editMode = false;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Failed to update profile';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while updating your profile.';
        console.error('Update error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.initializeEditForm();
    this.errorMessage = '';
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
}
