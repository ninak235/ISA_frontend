import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { CompanyAdminRegistration } from './model/companyAdminModel';
import { SystemAdminCreateComponent } from './system-admin-create/system-admin-create.component';
import { Customer } from './model/customer.model';
import { User } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  addCompanyClicked: EventEmitter<void> = new EventEmitter<void>();
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

  registerSystemAdmin(registrationSystemAdminForm: User) : Observable<User>{
    console.log(registrationSystemAdminForm)
    return this.http.post<User>(
      environment.apiHost + '/user/createSystemAdmin',
      registrationSystemAdminForm
    );
  }
  
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(environment.apiHost + '/customer/' + id);
  }

  getAdminById(id: number): Observable<CompanyAdminRegistration> {
    return this.http.get<CompanyAdminRegistration>(environment.apiHost + '/companyAdmin/' + id);
  }

  updateCustomerProfile(updatedProfile: Customer): Observable<void> {
    return this.http.put<void>(environment.apiHost + '/customer/update', updatedProfile);
  }

  updateAdminProfile(updatedProfile: CompanyAdminRegistration): Observable<void> {
    return this.http.put<void>(environment.apiHost + '/companyAdmin/updateAdmin', updatedProfile);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(environment.apiHost + '/user/' + userId);
  }
}
