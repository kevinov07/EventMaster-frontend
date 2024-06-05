import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, User, Recover } from '../interfaces/user';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL: string
  private myAPIUrl: string

  constructor(private http: HttpClient) { 
    this.URL = environment.endpoint
    this.myAPIUrl = 'users/create'
  }

  signUp(user: User): Observable<any>{
    
    console.log('Signing up with username:', user.username, 'email:',user.email, 'and password:', user.password)
    return this.http.post(`${this.URL}${this.myAPIUrl}`, user).pipe(
      catchError((error) => {
        console.error('Error signing up:', error);
        return throwError(() => error);
      })
    );
  }

  login(user: User): Observable<LoginResponse> {
    console.log('Logging in with username:', user.username, 'and password:', user.password)
    return this.http.post<LoginResponse>(`${this.URL}users/login`, user).pipe(
      catchError((error) => {
        console.error('Error logging in:', error);
        return throwError(() => error);
      })
    );
  }

  loadUserId(): number {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return +JSON.parse(userString).id;
      } catch (error) {
        console.error('Error parsing user JSON:', error);
        return 0; // Asignar 0 como valor predeterminado en caso de error
      }
    } else {
      return 0; // Asignar 0 como valor predeterminado si no se encuentra ningún usuario en el almacenamiento local
    }
  }

  recoverPasswordByEmail(recover: Recover) {
    return this.http.post<any>(`${this.URL}users/recover`, recover).pipe(
      catchError((error) => {
        console.error('Error recovering password:', error);
        return throwError(() => error);
      })
    );
  }

}
