import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getUserFromStorage());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Simulate social login
   */
  loginWithSocial(provider: string, userData: any): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: 'user_' + Date.now(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePhoto: userData.profilePhoto,
          createdAt: new Date()
        };

        this.setCurrentUser(user);
        observer.next({
          success: true,
          message: `Successfully logged in with ${provider}`,
          user: user,
          token: this.generateMockToken(user)
        });
        observer.complete();
      }, 1500);
    });
  }

  /**
   * Register user with complete profile
   */
  registerUser(formData: any): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          ...formData,
          id: 'user_' + Date.now(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.saveUserToStorage(user);
        this.setCurrentUser(user);

        observer.next({
          success: true,
          message: 'User registered successfully',
          user: user,
          token: this.generateMockToken(user)
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Update user profile
   */
  updateUserProfile(updatedData: Partial<User>): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            ...updatedData,
            email: currentUser.email, // Email should not be editable
            id: currentUser.id, // ID should not be editable
            updatedAt: new Date()
          };

          this.saveUserToStorage(updatedUser);
          this.setCurrentUser(updatedUser);

          observer.next({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
          });
        } else {
          observer.next({
            success: false,
            message: 'No user logged in'
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Private helper methods
   */
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.saveUserToStorage(user);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  private loadUserFromStorage(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  private generateMockToken(user: User): string {
    const tokenData = JSON.stringify({ id: user.id, email: user.email });
    return 'token_' + btoa(tokenData);
  }
}
