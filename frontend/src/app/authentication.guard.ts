import { AuthenticationService } from './authentication.service';
import {  CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router, private loginService: AuthenticationService) {}

  canActivate() {
    const isUserAuthenticated = this.loginService.isAuthenticated();
    if (!isUserAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
  
}
