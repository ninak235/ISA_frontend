import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CancelationModel, Reservation } from './model/reservation.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Router } from '@angular/router';
import { ReservationCalendar } from './model/reservationCalendar';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient, private router: Router) {}

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(
      environment.apiHost + '/reservations/new',
      reservation
    );
  }

  getAllReservationsByCompanyAdminId(
    companyAdminId: number
  ): Observable<ReservationCalendar[]> {
    console.log('ID: ', companyAdminId);
    return this.http.get<ReservationCalendar[]>(
      environment.apiHost + '/reservations/getAllByAdminId/' + companyAdminId
    );
  }
  getUserReservations(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      environment.apiHost + '/reservations/byUserId/' + userId
    );
  }

  cancelReservation(reservation: Reservation): Observable<CancelationModel> {
    return this.http.put<CancelationModel>(
      environment.apiHost + '/reservations/cancelReservation',
      reservation
    );
  }

  cancelReservationQR(reservation: Reservation): Observable<CancelationModel> {
    return this.http.put<CancelationModel>(
      environment.apiHost + '/reservations/cancelReservationQR',
      reservation
    );
  }

  pickUpReservation(reservation: Reservation): Observable<CancelationModel> {
    return this.http.put<CancelationModel>(
      environment.apiHost + '/reservations/pickUpReservation',
      reservation
    );
  }

  getPastUserReservations(userId: number): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(environment.apiHost + '/reservations/pastByUserId/' + userId);
  }
}
