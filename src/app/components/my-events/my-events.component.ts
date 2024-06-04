import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { AppEvent } from '../../interfaces/event';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {
  createdEvents: AppEvent[] = [];
  userId: number;
  attendingEvents: AppEvent[] = [];
  

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) {
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
    this.eventService.getEventByUser(this.userId).subscribe({
      next: (events) => {
        this.attendingEvents = events;
      },
      error: (err) => {
        console.error('Error fetching attending events:', err);
        this.toastr.error('Error fetching events. Please try again later.', 'Error');
      }
    });
  } 

  

  goToEvent(eventId: number): void {
    //this.router.navigate(['/event', eventId]);
  }
}
