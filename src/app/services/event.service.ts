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

  constructor(private http: HttpClient) {
    this.URL = environment.endpoint
  }

  createEvent(event: AppEvent): Observable<any> {
    console.log('Creating event:', event.title, 'on:', event.date, 'at:', event.location, 'with description:', event.description)
    return this.http.post(`${this.URL}event/create`, event).pipe(
      catchError((error) => {
        console.error('Error creating event:', error);
        return throwError(() => error);
      })
    );
  }

  getEventByUser(user_id: number): Observable<AppEvent[]> {
    console.log('Fetching events by user:', user_id)
    return this.http.get<AppEvent[]>(`${this.URL}event/created/${user_id}`).pipe(
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => error);
      })
    );
  }

  searchEvents(user_id: number, filters?: EventFilters): Observable<AppEvent[]> {
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

    params = params.append('userId', user_id.toString());

    console.log('Searching events with filters:', filters)
    return this.http.get<AppEvent[]>(`${this.URL}event/get-events`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events.....:', error);
        return throwError(() => error);
      })
    );
  }

  getEventsByUserSubscription(user_id: number): Observable<AppEvent[]> {
    console.log('Fetching events by user:', user_id)
    return this.http.get<AppEvent[]>(`${this.URL}event/suscriptions/${user_id}`).pipe(
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => error);
      })
    );
  }

  joinEvent(user_id: number, event_id: number): Observable<any> {
    console.log('Attending event:', event_id)
    return this.http.post(`${this.URL}registration/create`, {user_id, event_id}).pipe(
      catchError((error) => {
        console.error('Error attending event:', error);
        return throwError(() => error);
      })
    );
  }

  leaveEvent(user_id: number, event_id: number): Observable<any> {
    console.log('Leaving event:', event_id)
    return this.http.delete(`${this.URL}registration/delete-by-user`, {body:{user_id, event_id}}).pipe(
      catchError((error) => {
        console.error('Error leaving event:', error);
        return throwError(() => error);
      })
    );
  }

  deleteEvent(event_id: number): Observable<any> {
    console.log('Deleting event:', event_id)
    return this.http.delete(`${this.URL}event/delete/${event_id}`).pipe(
      catchError((error) => {
        console.error('Error deleting event:', error);
        return throwError(() => error);
      })
    );
  }
}
