import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TermsModalComponent } from '../terms-modal/terms-modal.component';
import { MatIcon } from '@angular/material/icon';

export function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const today = new Date();
    const dob = new Date(control.value);

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age < minAge ? { minimumAge: { requiredValue: minAge, actualValue: age } } : null;
  };
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TermsModalComponent, MatIcon],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  currentUser: any = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showTermsModal = false;
  agreedToTerms = false;
  previewPhoto: string | null = null;
  selectedPhotoFile: File | null = null;
  maxDate: string = '';
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 13);
    this.maxDate = today.toISOString().split('T')[0];

    // Must be authenticated (token present) to reach this page
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();

    // If user data isn't cached yet, fetch it first
    if (!this.currentUser) {
      this.isLoading = true;
      this.authService.fetchCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user;
          console.log('Successfully logged in. User details:', this.currentUser);
          this.initializeForm();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
      });
    } else {
      console.log('Successfully logged in. User details:', this.currentUser);
      this.initializeForm();
    }

    this.getUserLocation();
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('Location captured:', this.latitude, this.longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }

  initializeForm(): void {

    const userData = this.currentUser;

    if (!this.previewPhoto) {
      this.previewPhoto = userData.profilePic;
    }

    this.registrationForm = this.fb.group({
      email: [{ value: userData?.email || '', disabled: true }],
      userId: [{ value: userData?.id || userData?._id || '', disabled: true }],
      firstName: [userData?.firstName || '', [Validators.required, Validators.minLength(1)]],
      lastName: [userData?.lastName || '', [Validators.required, Validators.minLength(1)]],
      phone: [userData?.phone || '', [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]*$/)]],
      dateOfBirth: [this.formatDateForInput(userData?.dateOfBirth) || '', [Validators.required, minimumAgeValidator(13)]],
      gender: [userData?.gender || '', Validators.required],
      location: [userData?.location || ''],
      headline: [userData?.headline || ''],
      bio: [userData?.bio || '', Validators.maxLength(500)],
      website: [userData?.website || '', [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]],
      agreedToTerms: [false, Validators.requiredTrue],
      profileVisibility: [userData?.profileVisibility || 'All users'],
      emailVisibility: [userData?.emailVisibility || 'All users'],
      phoneVisibility: [userData?.phoneVisibility || 'All users'],
      showInNearbySearch: [userData?.showInNearbySearch !== undefined ? userData.showInNearbySearch : true]
    });
  }

  openTermsModal(): void {
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }

  agreeToTerms(): void {
    this.agreedToTerms = true;
    this.registrationForm.patchValue({ agreedToTerms: true });
    this.showTermsModal = false;
  }

  toggleTermsCheckbox(): void {
    const currentValue = this.registrationForm.get('agreedToTerms')?.value;
    if (!currentValue) {
      this.openTermsModal();
    } else {
      this.registrationForm.patchValue({ agreedToTerms: !currentValue });
      this.agreedToTerms = !currentValue;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.registrationForm.get('agreedToTerms')?.value) {
      this.errorMessage = 'You must agree to the Terms and Conditions.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Construct form data for registration
    const registrationData: any = {
      ...this.registrationForm.getRawValue(),
      registerUser: true,
      latitude: this.latitude,
      longitude: this.longitude
    };

    // Include profile photo if it exists (either new or existing)
    if (this.previewPhoto) {
      registrationData.profilePic = this.previewPhoto;
    }

    // Clean up unnecessary fields for the backend
    delete registrationData.agreedToTerms;

    this.authService.registerUser(registrationData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Registration completed successfully! Redirecting to profile...';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'An error occurred during registration. Please try again.';
        console.error('Registration error:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }


  resetForm(): void {
    this.registrationForm.reset();
    this.agreedToTerms = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.previewPhoto = null;
    this.selectedPhotoFile = null;
    this.initializeForm();
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

  formatDateForInput(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
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
    if (field.errors['minimumAge']) {
      return `You must be at least ${field.errors['minimumAge'].requiredValue} years old`;
    }

    return 'Invalid input';
  }
}
