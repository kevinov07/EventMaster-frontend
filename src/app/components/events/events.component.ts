import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Event } from '../../interfaces/event';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  searchForm: FormGroup;
  events: Event[] = [];

  constructor(
    private eventService: EventService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      title: new FormControl(''),
      category: new FormControl(''),
      date: new FormControl(''),
      location: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.searchEvents(); // Load initial events if needed
  }

  searchEvents(): void {
    const filters = this.searchForm.value;

    this.eventService.searchEvents(filters).subscribe({
      next: (events: Event[]) => {
        this.events = events;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.toastr.error('Error fetching events. Please try again later.', 'Error');
      }
    });
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }
}
