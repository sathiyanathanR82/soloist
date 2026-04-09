import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl; // http://localhost:3000/api
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  // ─── OAuth Social Login ────────────────────────────────────────────────────

  /**
   * Redirects the browser to the backend OAuth endpoint.
   * The backend handles the OAuth flow and then redirects to:
   *   http://localhost:4200/profile?token=<jwt>
   */
  loginWithSocial(provider: string): void {
    const providerMap: Record<string, string> = {
      'Gmail': 'google',
      'Facebook': 'facebook',
      'Microsoft': 'microsoft',
      'Yahoo': 'yahoo',
    };
    const backendProvider = providerMap[provider] || provider.toLowerCase();
    window.location.href = `${this.API_URL}/auth/${backendProvider}`;
  }

  // ─── Token & Callback Handling ─────────────────────────────────────────────

  /**
   * Called on the /profile page after an OAuth redirect.
   * Reads the ?token= query param, stores it, cleans the URL,
   * then fetches the real user from the backend.
   */
  handleAuthCallback(): Observable<User> {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      this.storeToken(token);
      // Clean the token from the URL bar without reloading
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    return this.fetchCurrentUser();
  }

  /**
   * Fetches the authenticated user from GET /api/auth/me.
   * The auth interceptor adds the Bearer token automatically.
   */
  fetchCurrentUser(): Observable<User> {
    return this.http.get<any>(`${this.API_URL}/auth/me`).pipe(
      tap(response => {
        // Extract user data from response wrapper
        const userData = response?.data || response;
        this.setCurrentUser(userData);
      }),
      catchError(err => {
        console.error('fetchCurrentUser error:', {
          status: err.status,
          message: err.message,
          error: err.error,
          token: this.getToken() ? 'Token exists' : 'No token'
        });
        if (err.status === 401) {
          this.clearSession();
        }
        return throwError(() => err);
      })
    );
  }

  // ─── Registration ──────────────────────────────────────────────────────────

  /**
   * Persists the completed registration form to the backend
   * via PUT /api/users/:id. The user must already be authenticated (has token).
   */
  registerUser(formData: any): Observable<AuthResponse> {
    const user = this.currentUserSubject.value as any;

    // Extract userId from various possible structures
    let userId = user?.uid || user?.id || user?._id || user?.data?.uid || user?.data?.id || user?.data?._id;

    if (!userId) {
      console.error('registerUser: No user ID found. User object:', user);
      return throwError(() => new Error('No authenticated user found. Please try logging in again.'));
    }

    return this.http.put<AuthResponse>(`${this.API_URL}/users/${userId}`, formData).pipe(
      tap(response => {
        const userData = response?.data || response?.user || response;
        if (response.success && userData) {
          this.setCurrentUser(userData);
        }
      }),
      catchError(err => {
        const message = err.error?.message || 'Registration failed. Please try again.';
        return throwError(() => new Error(message));
      })
    );
  }

  // ─── Profile Update ────────────────────────────────────────────────────────

  /**
   * Updates user profile via PUT /api/users/:id.
   */
  updateUserProfile(updatedData: Partial<User>): Observable<AuthResponse> {
    const user = this.currentUserSubject.value as any;

    // Extract userId from various possible structures
    let userId = user?.uid;
    if (!userId && user?.data) {
      userId = user.data.uid;
    }

    if (!userId) {
      console.error('User object structure:', user);
      return throwError(() => new Error('No user ID found. Unable to update profile.'));
    }

    return this.http.put<AuthResponse>(`${this.API_URL}/users/${userId}`, updatedData).pipe(
      tap(response => {
        const userData = response?.data || response?.user || response;
        if (response.success && userData) {
          this.setCurrentUser(userData);
        }
      }),
      catchError(err => {
        const message = err.error?.message || 'Profile update failed. Please try again.';
        return throwError(() => new Error(message));
      })
    );
  }

  // ─── User Management ───────────────────────────────────────────────────────

  /**
   * Fetches all registered users from GET /api/users.
   */
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users`).pipe(
      tap(response => { }),//console.log('Fetched all users:', response)),
      catchError(err => {
        console.error('getAllUsers error:', err);
        return throwError(() => err);
      })
    );
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  /**
   * Calls POST /api/auth/logout on the backend, then clears local session.
   */
  logout(): void {
    this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(), // clear locally even if server call fails
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
}
