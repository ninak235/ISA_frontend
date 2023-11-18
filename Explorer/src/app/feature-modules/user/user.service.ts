import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Customer } from './model/customer.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerCustomer(
    registrationForm: Customer
  ): Observable<Customer> {
    return this.http.post<Customer>(
      environment.apiHost + '/customer/registerCustomer',
      registrationForm
    );
  }
  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(environment.apiHost + '/customer/' + id);
  }

  updateProfile(updatedProfile: Customer): Observable<void> {
    return this.http.post<void>(environment.apiHost + '/customer/update', updatedProfile);
  }
}
