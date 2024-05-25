import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { Event } from '../interfaces/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private URL: string
  private myAPIUrl: string

  constructor(private http: HttpClient) {
    this.URL = environment.endpoint
    this.myAPIUrl = 'event/create'
  }

  createEvent(event: Event): Observable<any> {
    console.log('Creating event:', event.title, 'on:', event.date, 'at:', event.location, 'with description:', event.description)
    return this.http.post(`${this.URL}${this.myAPIUrl}`, event).pipe(
      catchError((error) => {
        console.error('Error creating event:', error);
        return throwError(() => error);
      })
    );
  }

  getEventByUser(userId: number): Observable<Event[]> {
    console.log('Fetching events by user:', userId)
    return this.http.get<Event[]>(`${this.URL}events/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => error);
      })
    );
  }

  searchEvents(filters: any): Observable<Event[]> {
    console.log('Searching events with filters:', filters)
    return this.http.get<Event[]>(`${this.URL}events`, { params: filters }).pipe(
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => error);
      })
    );
  }
}
