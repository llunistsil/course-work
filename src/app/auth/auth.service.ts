import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './models/user';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  #currentUser: User | null = null;
  #currentBot: string | null = null;

  get currentUser(): User | null {
    return this.#currentUser;
  }

  set currentUser(value: User | null) {
    this.#currentUser = value;
  }

  get currentBot(): string | null {
    return this.#currentBot;
  }

  set currentBot(value: string | null) {
    this.#currentBot = value;
  }

  public getBotName$(): Observable<string> {
    const url = `${environment.apiUrl}/login/bot-login`;

    const getBotName$ = this.http.get<string>(url);

    return getBotName$.pipe(
      catchError((res) => of(res)),
      map((res) => {
        console.log(res);
        switch (res.status) {
          case 200:
            this.#currentBot = res.error.text;
            break;
          default:
            throw new Error('Login error');
        }

        return res.error.text;
      })
    );
  }

  login(user: User): Observable<void> {
    const url = `${environment.apiUrl}/auth/login`;

    const loginObservable = this.http.post<void>(url, user, {
      observe: 'response',
      withCredentials: true
    });

    return loginObservable.pipe(
      catchError((res) => of(res)),
      map((res) => {
        switch (res.status) {
          case 200:
            this.currentUser = user;
            this.router.navigate(['/']);
            break;
          case 403:
            throw new Error('Wrong username or password');
          default:
            throw new Error('Login error');
        }

        return res.data!;
      })
    );
  }
}