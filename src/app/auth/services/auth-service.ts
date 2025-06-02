import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interface/auth-response.interface';
import { User } from '@auth/interface/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'

@Injectable({providedIn: 'root'})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  http = inject(HttpClient);


  checkStatusResource = rxResource(
    {
      loader: () => this.checkStatus()
    }
  )

  authStatus = computed<AuthStatus>(() => {
    if(this._authStatus() === 'checking') return 'checking';

    if(this._user()){
      return 'authenticated';
    }


    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token())
  role = computed(() => this._user()?.roles.includes('admin') ?? false);


  login(email: string, password: string) : Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`,{
      email: email,
      password: password
    }).pipe(
      map(r => this.handleAuthSuccess(r)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  register(email: string, password: string, fullName: string) : Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`,{
      email: email,
      password: password,
      fullName: fullName
    }).pipe(
      map(r => this.handleAuthSuccess(r)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token) {
      this.logout()
      of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).pipe(
      map(r => this.handleAuthSuccess(r)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout(){
    this._user.set(null),
    this._token.set(null),
    this._authStatus.set('not-authenticated');

    //TODO: REVERTIR
    // localStorage.removeItem('token')
  }

  private handleAuthSuccess({token, user} : AuthResponse){
    this._user.set(user);
    this._authStatus.set('authenticated'),
    this._token.set(token);

    localStorage.setItem('token',token)

    return true;
  }

  private handleAuthError(error: any){
    this.logout();
    return of(false);
  }
}
