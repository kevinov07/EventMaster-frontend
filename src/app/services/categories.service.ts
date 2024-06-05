import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { category } from '../interfaces/categories'


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private URL: string;
  private myAPIUrl: string;

  constructor(private http: HttpClient) {
    this.URL = environment.endpoint;
    this.myAPIUrl = 'eventCategory/get-all';
  }

  getAllEmails(): Observable<category[]> {
    console.log('Fetching all emails');
    return this.http.get<category[]>(`${this.URL}${this.myAPIUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching emails:', error);
        return throwError(() => error);
      })
    );
  }
}
