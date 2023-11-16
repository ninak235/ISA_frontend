import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
5;
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { CustomerRegistration } from './model/customerModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerCustomer(
    registrationForm: CustomerRegistration
  ): Observable<CustomerRegistration> {
    return this.http.post<CustomerRegistration>(
      environment.apiHost + '/customer/registerUser',
      registrationForm
    );
  }
}
