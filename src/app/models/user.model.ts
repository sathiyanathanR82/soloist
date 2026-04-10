export interface SocialLoginProvider {
  name: string;
  icon: string;
  color: string;
  clientId: string;
  authUrl: string;
}

export interface User {
  data?: any;
  id?: string;
  uid?: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  profilePhoto?: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  website?: string;
  facebookProfile?: string;
  registerUser?: boolean;
  latitude?: number;
  longitude?: number;
  network?: {
    myNetwork: string[];
    request: string[];
    block: string[];
    removalRequest: string[];
  };
  lastLogin?: Date | string;
  isOnline?: boolean;
  profileVisibility?: 'All users' | 'Only my network' | 'Only me';
  emailVisibility?: 'All users' | 'Only my network' | 'Only me';
  phoneVisibility?: 'All users' | 'Only my network' | 'Only me';
  showInNearbySearch?: boolean;
  deletion?: boolean;
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
  profileVisibility?: string;
  emailVisibility?: string;
  phoneVisibility?: string;
  showInNearbySearch?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  data?: any;
  token?: string;
}
