import { Component} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { AppEvent } from '../../interfaces/event';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  events: AppEvent[] = [];

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.loadMainEvents();
  }

  loadMainEvents(): void {
    this.eventService.getMainEvents().subscribe({
      next: (events) => {
        this.events = events;
        console.log('Main events:', events);
      },
      error: (err) => {
        console.error('Error fetching main events:', err);
        this.toastr.error('Error fetching main events. Please try again later.', 'Error');
      }
    });
  }

  // events1 = [
  //   { id: 1, title: 'The Chainsmokers', date: new Date('2024-06-10'), location: 'Madison Square Garden', time: '8:30 pm', description: 'a good event', category: 'Music'},
  //   { id: 2, title: 'Tame Impala', date: new Date('2024-07-09'), location: 'Barclays Center', time: '8:30 pm', description: 'a good event', category: 'Music'},
  //   { id: 3, title: 'Hans Zimmer Live', date: new Date('2022-08-21'), location: 'Radio City Music Hall', time: '8:30 pm', description: 'a good event', category: 'Music'}, 
  //   { id: 4, title: 'The Weeknd', date: new Date('2024-08-09') , location: 'Prudential Center', time: '8:30 pm', description: 'a good event', category: 'Music'},
  //   { id: 5, title: 'Adele', date: new Date('2024-09-02'),  location: 'MetLife Stadium', time: '8:30 pm', description: 'a good event', category: 'Music'},
  //   { id: 6, title: 'Billie Eilish', date: new Date('2024-10-09'), location: 'Barclays Center', time: '8:30 pm', description: 'a good event', category: 'Music'},
    
  // ];
}
