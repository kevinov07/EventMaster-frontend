import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { AppEvent, EventFilters } from '../../interfaces/event';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  searchForm: FormGroup;
  events: AppEvent[] = [];
  selectedEvent: AppEvent | null = null;
  userId: number;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      title: new FormControl(''),
      category: new FormControl(''),
      date: new FormControl(''),
      location: new FormControl('')
    });
    this.userId = 0;
  }

  ngOnInit(): void {
    this.userId = this.userService.loadUserId();
    this.loadEvents();
  }

  searchEvents(): void {
    const filters = this.searchForm.value;
    this.loadEvents(filters);
  }

  loadEvents(filters?: EventFilters): void {
    forkJoin({
      events: this.eventService.searchEvents(this.userId, filters),
      joinedEvents: this.eventService.getEventsByUserSubscription(this.userId)
    }).subscribe({
      next: ({ events, joinedEvents }) => {
        const joinedEventIds = joinedEvents.map(e => e.id);
        this.events = events.map(event => ({
          ...event,
          isAttending: joinedEventIds.includes(event.id)
        }));
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.toastr.error('Error fetching events. Please try again later.', 'Error');
      }
    });
  }

  joinedEvents(): void {
    this.eventService.getEventsByUserSubscription(this.userId).subscribe({
      next: (events: AppEvent[]) => {
          // Obtener los IDs de los eventos a los que el usuario está inscrito
        const joinedEventIds = events.map(e => e.id);

        // Marcar los eventos en el array 'events' como 'isAttending'
        this.events.forEach(event => {
          event.isAttending = joinedEventIds.includes(event.id);
        });
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.toastr.error('Error fetching events. Please try again later.', 'Error');
      }
    });
  }

  joinEvent(userId: number, eventId: number): void {
    this.eventService.joinEvent(userId, eventId).subscribe({
      next: () => {
        this.toastr.success('Successfully registered for event.', 'Success');
        const event = this.events.find(e => e.id === eventId);
        event && (event.isAttending = true);
      },
      error: (err) => {
        console.error('Error attending event:', err);
        this.toastr.error('Error attending event. Please try again later.', 'Error');
      }
    });
  }

  leaveEvent(userId: number, eventId: number): void {
    this.eventService.leaveEvent(userId, eventId).subscribe({
      next: () => {
        this.toastr.success('Successfully unregistered for event.', 'Success');
        const event = this.events.find(e => e.id === eventId);
        event && (event.isAttending = false);
      },
      error: (err) => {
        console.error('Error leaving event:', err);
        this.toastr.error('Error leaving event. Please try again later.', 'Error');
      }
    });
  }

  setSelectedEvent(event: AppEvent): void {
    this.selectedEvent = event;
  }
}