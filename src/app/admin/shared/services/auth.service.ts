import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'}) // registration of service on global level
export class AuthService {
  // symbol $, because it is STREAM. It get type Subject(something like Observable, only you can emit events)
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    // checking if token not expired
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      user
    ).pipe(
      tap(this.setToken),
      catchError(this.handleError.bind(this))
      // we use method bind(this) because not to lost context of "this" that we use in method handleError
    );
  }

  logout(): void {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token; // !! -> convert to the boolean value
  }

  private handleError(error: HttpErrorResponse){
    const {message} = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email isn\'t found');
        break;
    }
    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null): void {
    if (response) {
      // getting time when token will be expired!
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      // storing data in local storage
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }

  }
}
