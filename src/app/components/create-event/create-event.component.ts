import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AppEvent } from '../../interfaces/event';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/categories.service';
import { category } from '../../interfaces/categories';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [RouterLink, HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit {
  eventsForm: FormGroup;
  userId: number;
  categories: category[] = []; // Añade una propiedad para las categorías

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService, // Inyecta el servicio EmailService
    private router: Router, 
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.eventsForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
    });

    this.userId = this.userService.loadUserId();
  }

  ngOnInit(): void {
    this.loadCategories(); // Carga las categorías cuando se inicializa el componente
  }

  loadCategories() {
    this.categoryService.getAllEmails().subscribe(
      (data: category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
        this.toastr.error('Error loading categories. Please try again.', 'Error');
      }
    );
  }

  CreateEvent() {
    if (this.eventsForm.invalid) {
      this.toastr.error('Please fill out all fields correctly.');
      return;
    }

    const event: AppEvent = {
      ...this.eventsForm.value,
      category: this.getCategoryId(this.eventsForm.value.category),
      user_id: this.userId
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

  private getCategoryId(categoryName: string): number {
    const category = this.categories.find(cat => cat.name === categoryName);
    return category ? category.id : 0;
  }
}
