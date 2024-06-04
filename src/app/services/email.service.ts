import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private URL: string;
  private myAPIUrl: string;

  constructor(private http: HttpClient) {
    this.URL = environment.endpoint;
    this.myAPIUrl = 'email/send';
  }

  sendEmail(to: string): Observable<{ verificationCode: string }> {
    const body = { to: to };
    console.log('Sending email to:', to);
    return this.http.post<{ verificationCode: string }>(`${this.URL}${this.myAPIUrl}`, body).pipe(
      catchError((error) => {
        console.error('Error sending email:', error);
        return throwError(() => error);
      })
    );
  }
}
