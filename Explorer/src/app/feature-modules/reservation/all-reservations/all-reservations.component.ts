import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { ReservationCalendar } from '../model/reservationCalendar';
import { ReservationService } from '../reservation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { EventInput } from '@fullcalendar/core';

@Component({
  selector: 'xp-all-reservations',
  templateUrl: './all-reservations.component.html',
  styleUrls: ['./all-reservations.component.css']
})
export class AllReservationsComponent implements OnInit  {
  reservations: ReservationCalendar[] = []; 
  userId: number;

  constructor(private reservationService: ReservationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.user$.getValue().id;
    this.fetchReservationData();
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin],
    initialView: 'multiMonthYear',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek'
    },
    views: {
      timeGrid: {
        dayMaxEvents: 4
      },
      year: {
        type: 'dayGrid',
        duration: { years: 1 }
      }
    },

    eventClick: (info) => {
      // info.event sadrži sve informacije o događaju
      const reservationId = info.event.id;
      const reservationTitle = info.event.title;
      const reservationStart = info.event.start;
  
      // Implementirajte logiku prikaza informacija o događaju, na primer, putem modala ili drugog prikaza
      console.log('Clicked on event:', reservationId, reservationTitle, reservationStart);
      // Ovde možete implementirati logiku za prikaz dodatnih informacija
    },

    events: [] as EventInput[]
  }

  fetchReservationData(): void {
    this.reservationService.getAllReservationsByCompanyAdminId(this.userId).subscribe({
      next: (result: ReservationCalendar[]) => {
        this.reservations = result;
        console.log(this.reservations)
        this.updateCalendarEvents();
      },
      error: (error: any) => {
        console.error('Error loading companies', error);
      },
    });
  }  
  

  updateCalendarEvents(): void {
    // Assuming your FullCalendar events should have 'id', 'title', 'start', 'end', etc.
    const events: EventInput[] = this.reservations.map((reservation) => {
      const dateTimeArray = reservation.dateTime;
      
      // Use the Date constructor to create a Date object from the array
      const dateObject = new Date(dateTimeArray[0], dateTimeArray[1] - 1, dateTimeArray[2], dateTimeArray[3], dateTimeArray[4]);
  
      return {
        id: String(reservation.id), // Convert id to string
        title: `${reservation.customerName} ${reservation.customerLastName} - Duration: ${reservation.duration} hours`,
        start: dateObject, // Use the Date object for the 'start' property
      };
    });
  
    // Update the calendar events
    this.calendarOptions.events = events;
  }
  
}

