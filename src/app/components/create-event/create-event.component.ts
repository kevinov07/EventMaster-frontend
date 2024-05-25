import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators  } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Event } from '../../interfaces/event';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [RouterLink, HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  eventsForm: FormGroup;
  userId: number = 1; // Hardcoded for now

  constructor(private eventService: EventService, private router: Router, private toastr: ToastrService) {
    this.eventsForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });
  }

  CreateEvent() {
    if (this.eventsForm.invalid) {
      this.toastr.error('Please fill out all fields correctly.');
      return;
    }

    const event: Event = {
      ...this.eventsForm.value,
      userId: this.userId

    }

    this.eventService.createEvent(event)
      .subscribe({
        next: (response) => {
          console.log('Event created:', response)
          this.toastr.success('Event created successfully.', 'Success!');
          this.eventsForm.reset();
        },
        error: (e: HttpErrorResponse) => {
          console.error('Error creating event:', e); 
          e.error.message
            ? this.toastr.error(e.error.message, 'Error')
            : this.toastr.error('An error occurred. Please try again.', 'Error'); 
        }
      });
  }

}

