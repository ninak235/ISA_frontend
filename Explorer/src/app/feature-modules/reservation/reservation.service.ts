import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from './model/reservation.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient,
    private router: Router) { }

  createReservation(reservation: Reservation): Observable<Reservation> {
      return this.http.post<Reservation>(
        environment.apiHost + '/reservations/new',
        reservation
      );
  }

  getUserReservations(userId: number): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(environment.apiHost + '/reservations/byUserId/' + userId);
  }
}
