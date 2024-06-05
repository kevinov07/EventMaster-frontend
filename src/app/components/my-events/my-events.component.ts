import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { AppEvent } from '../../interfaces/event';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {
  createdEvents: AppEvent[] = [];
  userId: number;
  attendingEvents: AppEvent[] = [];
  editingEventId: number | null = null;
  editEventForm: FormGroup;
  

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.editEventForm = new FormGroup({
      title: new FormControl(''),
      category: new FormControl(''),
      date: new FormControl(''),
      time: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl('')
    });
    this.userId = 0;
  }

  ngOnInit(): void {
    this.userId = this.userService.loadUserId();
    this.loadUserEvents();
    this.loadAttendingEvents();

  }

  loadUserEvents(): void {
    console.log(typeof this.userId);
    this.eventService.getEventByUser(this.userId).subscribe({
      next: (events) => {
        this.createdEvents = events;
      },
      error: (err) => {
        console.error('Error fetching user events:', err);
        this.toastr.error('Error fetching events. Please try again later.', 'Error');
      }
    });
  }

  loadAttendingEvents(): void {
    this.eventService.getEventsByUserSubscription(this.userId).subscribe({
      next: (events) => {
        this.attendingEvents = events;
      },
      error: (err) => {
        console.error('Error fetching attending events:', err);
        this.toastr.error('Error fetching events. Please try again later.', 'Error');
      }
    });
  } 

  editEvent(event: AppEvent): void {
    this.editingEventId = event.id!;
  }

  leaveEvent(userId: number, eventId: number): void {
    this.eventService.leaveEvent(userId, eventId).subscribe({
      next: () => {
        this.toastr.success('You have left the event', 'Success');
        this.loadAttendingEvents();
        this.loadUserEvents();
      },
      error: (err) => {
        console.error('Error leaving event:', err);
        this.toastr.error('Error leaving event. Please try again later.', 'Error');
      }
    });
  }

  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId!).subscribe({
      next: () => {
        this.toastr.success('Event deleted successfully', 'Success');
        this.loadUserEvents();
      },
      error: (err) => {
        console.error('Error deleting event:', err);
        this.toastr.error('Error deleting event. Please try again later.', 'Error');
      }
    });
  }
}
