import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TermsModalComponent } from '../terms-modal/terms-modal.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TermsModalComponent],
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.initializeForm();
  }

  initializeForm(): void {
    this.registrationForm = this.fb.group({
      email: [{ value: this.currentUser?.email || '', disabled: true }, Validators.required],
      userId: [{ value: this.currentUser?.id || '', disabled: true }, Validators.required],
      firstName: [this.currentUser?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [this.currentUser?.lastName || '', [Validators.required, Validators.minLength(2)]],
      phone: [this.currentUser?.phone || '', [Validators.pattern(/^[0-9\-\+\(\)\s]*$/)]],
      dateOfBirth: [this.currentUser?.dateOfBirth || '', Validators.required],
      gender: [this.currentUser?.gender || '', Validators.required],
      location: [this.currentUser?.location || ''],
      headline: [this.currentUser?.headline || ''],
      bio: [this.currentUser?.bio || '', Validators.maxLength(500)],
      website: [this.currentUser?.website || '', [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]],
      agreedToTerms: [false, Validators.requiredTrue]
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

    const formData = this.registrationForm.getRawValue();
    delete formData.agreedToTerms;

    this.authService.registerUser(formData).subscribe({
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
        this.errorMessage = 'An error occurred during registration. Please try again.';
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
    this.initializeForm();
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

    return 'Invalid input';
  }
}
