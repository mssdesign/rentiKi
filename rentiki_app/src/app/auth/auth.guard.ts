import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.userIsAuthenticated) {
      this.router.navigateByUrl('/auth');
    }

  return this.authService.userIsAuthenticated;
}

//Guards podem ser adicionados a rotas para controlar o acesso e identificar o usuário