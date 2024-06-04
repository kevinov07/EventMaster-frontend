import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { AppEvent, EventFilters } from '../interfaces/event';

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

  createEvent(event: AppEvent): Observable<any> {
    console.log('Creating event:', event.title, 'on:', event.date, 'at:', event.location, 'with description:', event.description)
    return this.http.post(`${this.URL}${this.myAPIUrl}`, event).pipe(
      catchError((error) => {
        console.error('Error creating event:', error);
        return throwError(() => error);
      })
    );
  }

  getEventByUser(userId: number): Observable<AppEvent[]> {
    console.log('Fetching events by user:', userId)
    return this.http.get<AppEvent[]>(`${this.URL}event/created/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => error);
      })
    );
  }

  searchEvents(filters?: EventFilters): Observable<AppEvent[]> {
    let params = new HttpParams();

    // Verifica si el objeto filters está definido y si tiene valores
    if (filters) {
      for (const key in filters) {

        const value = filters[key as keyof EventFilters];
        if (value !== null && value !== undefined && value !== '') {
          params = params.append(key, value);
        }
      }
    }

    console.log('Searching events with filters:', filters)
    return this.http.get<AppEvent[]>(`${this.URL}event/get-events`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => error);
      })
    );
  }
}
