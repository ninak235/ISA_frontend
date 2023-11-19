import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { CompanyAdminRegistration } from './model/companyAdminModel';
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

  registerCompanyAdmin(registrationAdminForm: CompanyAdminRegistration): Observable<CompanyAdminRegistration>{
    console.log("companyAdmin:", registrationAdminForm.companyId)
    return this.http.post<CompanyAdminRegistration>(
      environment.apiHost + '/companyAdmin/registerCompanyAdmin',
      registrationAdminForm
    );
  }
  
  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(environment.apiHost + '/customer/' + id);
  }

  updateProfile(updatedProfile: Customer): Observable<void> {
    return this.http.put<void>(environment.apiHost + '/customer/update', updatedProfile);
  }
}
