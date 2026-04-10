import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Check if they are mid-oauth callback via the token query param
  const urlParams = new URL(window.location.href).searchParams;
  const hasToken = urlParams.has('token');

  if (hasToken) {
    // If they have a token in URL, they are actively logging in. Allow access.
    // The components (e.g. ProfileComponent) handle consuming that token.
    return true;
  }

  // Redirect to login if not authenticated
  return router.parseUrl('/login');
};
