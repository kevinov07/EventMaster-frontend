import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private URL: string
  // private myAPIUrl: string

  // constructor(private http: HttpClient) { 
  //   this.URL = environment.endpoint
  //   this.myAPIUrl = this.URL + 'api/users/'
  // }

  signUp(user: User) {
    
    console.log('Signing up with username:', user.username, 'and password:', user.password)
    // return this.http.post(`${this.URL}${this.myAPIUrl}`, user)
  }
}

