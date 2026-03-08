export interface SocialLoginProvider {
  name: string;
  icon: string;
  color: string;
  clientId: string;
  authUrl: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  website?: string;
  linkedinProfile?: string;
  facebookProfile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegistrationFormData {
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

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}
