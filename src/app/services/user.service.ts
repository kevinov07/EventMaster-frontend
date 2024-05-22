import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
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
}

