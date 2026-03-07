# Development Guide - Soloist Angular App

## 🎓 Architecture Overview

This application follows Angular best practices with a component-based architecture:

```
App (Root)
├── Navbar (Shared in all routes)
└── Router Outlet
    ├── Login Component
    ├── Registration Component
    └── Profile Component
```

## 🏗️ Component Descriptions

### Login Component
**Location**: `src/app/components/login/`

Displays social login options for:
- Facebook (#1877F2)
- LinkedIn (#0A66C2)
- Gmail (#DC3545)
- Yahoo (#7B0099)
- Microsoft (#0078D4)

**Key Features**:
- Mock OAuth provider buttons
- Loading state during authentication
- Error message display
- Gradient background design
- Responsive button layout

**Flow**: User clicks provider → AuthService.loginWithSocial() → Mock auth delay → Redirect to registration

### Registration Component
**Location**: `src/app/components/registration/`

Complete user registration form with:
- Pre-filled user data from social login
- Non-editable fields (email, userId)
- Form validation
- Terms & conditions checkbox
- Terms modal integration

**Key Fields**:
```
Non-Editable:
- Email (from social provider)
- User ID (auto-generated)

Required Fields:
- First Name (min 2 chars)
- Last Name (min 2 chars)
- Date of Birth
- Gender
- Terms & Conditions agreement

Optional Fields:
- Phone (pattern validation)
- Location
- Headline
- Bio (max 500 chars)
- Website (URL validation)
- Linked-in/Facebook profiles
```

**Validation Rules**:
```typescript
firstName: [required, minLength(2)]
lastName: [required, minLength(2)]
email: [required] - disabled/non-editable
userId: [required] - disabled/non-editable
phone: [pattern(/^[0-9\-\+\(\)\s]*$/)]
website: [pattern(/^(https?:\/\/)?.../)]
bio: [maxLength(500)]
dateOfBirth: [required]
gender: [required]
agreedToTerms: [required]
```

### Profile Component
**Location**: `src/app/components/profile/`

Displays user profile information in sections:
- Account Information (non-editable)
- Personal Information (editable)
- Professional Information (editable)
- Bio Display

**Features**:
- Profile completion percentage
- Member since date
- Edit mode toggle
- Save/Cancel buttons
- Success/error messages
- Form validation in edit mode

### Terms Modal Component
**Location**: `src/app/components/terms-modal/`

Modal dialog showing complete terms and conditions.

**Features**:
- Scrollable content area
- Close button
- "I Agree" confirmation button
- Overlay background
- Animation on open/close

### Navbar Component
**Location**: `src/app/components/navbar/`

Navigation bar visible on all pages.

**Features**:
- Branding (Soloist logo)
- User avatar with initials
- Dropdown menu (Profile, Logout)
- Sticky positioning
- Responsive design

## 🔌 Services

### AuthService
**Location**: `src/app/services/`

Manages authentication and user data.

**Methods**:

```typescript
// Login with social provider
loginWithSocial(provider: string, userData: any): Observable<AuthResponse>

// Register new user
registerUser(formData: any): Observable<AuthResponse>

// Update user profile
updateUserProfile(updatedData: Partial<User>): Observable<AuthResponse>

// Get current user
getCurrentUser(): User | null

// Check authentication status
isAuthenticated(): boolean

// Logout
logout(): void
```

**Observables**:
```typescript
currentUser$: Observable<User | null>        // Current logged-in user
isAuthenticated$: Observable<boolean>         // Authentication status
```

**Internal Storage**:
- Uses localStorage with key `'currentUser'`
- Persists user data across page reloads
- Auto-loads user on service initialization

## 📊 Data Models

**User Interface**:
```typescript
interface User {
  id: string;                    // Auto-generated unique ID
  email: string;                 // From social provider
  firstName: string;
  lastName: string;
  profilePhoto?: string;         // Avatar URL
  headline?: string;             // Professional title
  bio?: string;                  // Personal bio
  location?: string;             // City, Country
  phone?: string;               // Contact number
  dateOfBirth?: string;         // Date string
  gender?: string;              // Gender selection
  website?: string;             // Portfolio/personal site
  linkedinProfile?: string;
  facebookProfile?: string;
  createdAt?: Date;             // Registration timestamp
  updatedAt?: Date;             // Last update timestamp
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

interface RegistrationFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  website?: string;
  dateOfBirth?: string;
  gender?: string;
  agreedToTerms: boolean;
}
```

## 🎯 Routing

**Routes**:
```
/ or /login          → LoginComponent
/registration        → RegistrationComponent
/profile             → ProfileComponent
/**                  → Redirect to /login
```

**Route Guards** (Future Enhancement):
```typescript
// Can add CanActivate guards to protect routes
// Example: AuthGuard to ensure user is logged in before accessing profile
```

## 🎨 Styling Architecture

**Global Styles**: `src/styles.scss`
- Reset CSS
- Typography
- Form elements
- Common button styles
- Scrollbar styling

**Component Styles**: Each component has its own `.scss` file
- Component-specific styles
- Scoped to component selector
- Responsive breakpoints at 600px and 768px

**Colors Used**:
- Primary Blue: `#667eea`
- Purple: `#764ba2`
- Facebook Blue: `#1877f2`
- LinkedIn Blue: `#0A66C2`
- Gmail Red: `#DC3545`
- Yahoo Purple: `#7B0099`
- Microsoft Blue: `#0078D4`
- Light Gray: `#f0f2f5`

**Responsive Breakpoints**:
```scss
// Mobile: < 600px
// Tablet: 600px - 768px
// Desktop: > 768px

// Grid adjustments:
form-row-2 {
  @media (max-width: 600px) {
    grid-template-columns: 1fr;  // Single column on mobile
  }
}
```

## 🔄 Data Flow

### Login Flow
```
1. User clicks social provider
2. LoginComponent calls authService.loginWithSocial()
3. AuthService simulates auth delay (1.5s)
4. Creates mock User object
5. Saves to localStorage
6. Updates currentUser$ observable
7. AuthComponent subscribes to observable
8. Navigate to /registration
```

### Registration Flow
```
1. RegistrationComponent loads with pre-filled form
2. CurrentUser from AuthService updates form
3. User edits optional fields
4. User checks Terms checkbox (optional modal)
5. User clicks Complete Registration
6. Form validation passes
7. AuthService.registerUser() saves to localStorage
8. AuthService updates currentUser$ observable
9. Navigate to /profile
```

### Profile Edit Flow
```
1. ProfileComponent displays current user data
2. Click Edit Profile toggles editMode
3. Form loads with current user data
4. User modifies fields
5. Click Save Changes
6. AuthService.updateUserProfile() validates & saves
7. currentUser$ observable updates
8. ProfileComponent refreshes with new data
9. Edit mode toggles off
```

## 🔐 Security Considerations

**Current Implementation** (Demo):
- Uses localStorage (not secure for sensitive data)
- No backend validation
- No encryption
- No authentication tokens

**For Production**:
1. Use HTTPOnly cookies for tokens
2. Implement real OAuth with proper scopes
3. Backend API with authentication middleware
4. Never store sensitive data in localStorage
5. Use HTTPS only
6. Implement CSRF protection
7. Add refresh token rotation
8. API key management

## 🧪 Testing Strategy

### Unit Tests
- Service tests for auth, user data
- Component tests for user interactions
- Directive and pipe tests (if added)

### E2E Tests
- Login flow
- Registration flow
- Profile editing flow
- Logout flow

### Test Commands
```bash
ng test              # Run unit tests
ng e2e              # Run end-to-end tests
ng test --code-coverage  # Generate coverage report
```

## 📦 Dependencies

**Core Angular**:
- @angular/core
- @angular/common
- @angular/forms
- @angular/router
- @angular/platform-browser
- @angular/animations

**Supporting Libraries**:
- rxjs
- tslib
- zone.js

**Development Tools**:
- @angular-devkit/build-angular
- @angular/cli
- @angular/compiler-cli
- typescript

## 🚀 Build & Deployment

**Development Build**:
```bash
ng serve
# Runs on http://localhost:4200
# Hot reload enabled
```

**Production Build**:
```bash
ng build --configuration production
# Output in dist/soloist/
# Optimized, minified code
# Tree-shaken unused code
```

**Add Environment-Specific Configuration**:
1. Create `src/environments/environment.prod.ts`
2. Update `angular.json` fileReplacements
3. Use `environment` in services

## 🐛 Debugging Tips

1. **Browser DevTools**:
   - Sources tab to set breakpoints
   - Console tab for error messages
   - Network tab to inspect HTTP calls
   - Application tab to check localStorage

2. **Angular DevTools** (Chrome Extension):
   - Component tree inspection
   - Change detection debugging
   - Dependency injection viewing

3. **Console Logging**:
   ```typescript
   console.log('User:', this.currentUser);
   console.log('Form Valid:', this.form.valid);
   ```

4. **localStorage Inspection**:
   ```javascript
   // In browser console
   JSON.parse(localStorage.getItem('currentUser'))
   ```

## 📚 Learning Resources

- [Angular Documentation](https://angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Guide](https://rxjs.dev/guide/overview)
- [Angular Security Guide](https://angular.io/guide/security)
- [Angular Form Validation](https://angular.io/guide/form-validation)

## 🤝 Contributing Guidelines

1. Create feature branch
2. Follow component structure
3. Add proper TypeScript types
4. Write unit tests
5. Test responsive design
6. Submit pull request

---

**Last Updated**: March 6, 2026
**Version**: 1.0.0
