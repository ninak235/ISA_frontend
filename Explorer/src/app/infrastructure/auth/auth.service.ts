import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorage } from './jwt/token.service';
import { environment } from 'src/env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './model/login.model';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>({
    id: 0,
    username: '',
    role: { roles: [] }
  });

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  login(login: Login): Observable<AuthenticationResponse> {
    console.log(login);
    return this.http
      .post<AuthenticationResponse>(environment.autHost + '/login', login)
      .pipe(
        tap((authenticationResponse) => {
          console.log(authenticationResponse);
          console.log('===========');
          this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
          this.setUser();
        })
      );
  }


  logout(): void {
    console.log('Logout initiated...');
  
    this.tokenStorage.clear();
      this.user$.next({ username: '', id: 0, role: { roles: [] }});
  
    console.log('Before navigate to login');
    this.router.navigate(['/login']).then(() => {
      console.log('Navigate to login successful.');
    });
    console.log('After navigate to login');
  }
  

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken == null) {
      return;
    }
    this.setUser();
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const rolesArray = jwtHelperService
      .decodeToken(accessToken)
      .role.map((role: any) => role.name);
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).sub,
      role: { roles: rolesArray }
    };
    console.log(user.id);
    console.log(user.username);
    console.log(user.role);
    this.user$.next(user);
  }
}
