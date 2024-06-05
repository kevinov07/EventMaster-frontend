import { Component} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  events = [
    { id: 1, name: 'The Chainsmokers', date: new Date('2024-06-10'), venue: 'univalle', image: '/assets/images/concierto2.jpg' },
    { id: 2, name: 'Tame Impala', date: new Date('2024-07-09'), venue: 'calima', image: '/assets/images/concert.jpg'},
    { id: 3, name: 'Hans Zimmer Live', date: new Date('2022-08-21'), venue: 'TBD', image: '/assets/images/concert.jpg'},
    { id: 4, name: 'The Weeknd', date: new Date('2024-08-09') ,venue: 'TBD', image: '/assets/images/fiesta.jpg'},
    { id: 5, name: 'Adele', date: new Date('2024-09-02'), venue: 'TBD', image: '/assets/images/concert.jpg'},
    { id: 6, name: 'Billie Eilish', date: new Date('2024-10-09'), venue: 'TBD', image: '/assets/images/concert.jpg'},
    
  ];
}
