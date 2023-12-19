import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { CompanyAdminRegistration } from './model/companyAdminModel';
import { SystemAdminCreateComponent } from './system-admin-create/system-admin-create.component';
import { Customer } from './model/customer.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { SystemUser } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  addCompanyClicked: EventEmitter<void> = new EventEmitter<void>();
  constructor(private http: HttpClient) {}

  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  registerCustomer(registrationForm: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      environment.autHost + '/registerCustomer',
      registrationForm
    );
  }

  registerCompanyAdmin(
    registrationAdminForm: CompanyAdminRegistration
  ): Observable<CompanyAdminRegistration> {
    return this.http.post<CompanyAdminRegistration>(
      environment.apiHost + '/companyAdmin/registerCompanyAdmin',
      registrationAdminForm
    );
  }

  registerSystemAdmin(registrationSystemAdminForm: SystemUser) : Observable<SystemUser>{
    console.log(registrationSystemAdminForm)
    return this.http.post<SystemUser>(
      environment.apiHost + '/user/createSystemAdmin',
      registrationSystemAdminForm
    );
  }
  
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(environment.apiHost + '/customer/' + id);
  }

  getAdminById(id: number): Observable<CompanyAdminRegistration> {
    return this.http.get<CompanyAdminRegistration>(
      environment.apiHost + '/companyAdmin/' + id
    );
  }

  updateCustomerProfile(updatedProfile: Customer): Observable<void> {
    return this.http.put<void>(
      environment.apiHost + '/customer/update',
      updatedProfile
    );
  }

  updateAdminProfile(
    updatedProfile: CompanyAdminRegistration
  ): Observable<void> {
    return this.http.put<void>(
      environment.apiHost + '/companyAdmin/updateAdmin',
      updatedProfile
    );
  }

  updateSystemAdminPassword(updatedSystemAdmin: SystemUser) :Observable<void>{
    console.log("UPDATOVAN: ", updatedSystemAdmin)
    return this.http.put<void>(
      environment.apiHost + '/user/updateSystemAdmin',
      updatedSystemAdmin
    );
  }

  getUserById(userId: number): Observable<SystemUser> {
    return this.http.get<SystemUser>(environment.apiHost + '/user/' + userId);
  }
}
