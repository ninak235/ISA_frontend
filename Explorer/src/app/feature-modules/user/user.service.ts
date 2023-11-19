import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
5;
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { CustomerRegistration } from './model/customerModel';
import { CompanyAdminRegistration } from './model/companyAdminModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerCustomer(
    registrationForm: CustomerRegistration
  ): Observable<CustomerRegistration> {
    return this.http.post<CustomerRegistration>(
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
}
