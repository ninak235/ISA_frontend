import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company, CompanyAdmin } from './model/companyModel';
import { environment } from 'src/env/environment';
import { CompanyIdName } from './model/companyIdName';
import { AvailableDate } from './model/availableDateModel';
import { CompanyAdminRegistration } from '../user/model/companyAdminModel';
import { Contract } from './model/contract';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  getExtraAdminAvailableDates(
    companyName: string,
    adminId: number,
    selectedDate: string
  ): Observable<AvailableDate[]> {
    return this.http.get<AvailableDate[]>(
      environment.apiHost +
        '/availableDate/getExtraByCompanyIdAndAdminId/' +
        companyName +
        '/' +
        adminId +
        '/' +
        selectedDate
    );
  }

  getAdmin(adminId: number): Observable<CompanyAdminRegistration> {
    return this.http.get<CompanyAdminRegistration>(
      environment.apiHost + '/companyAdmin/' + adminId
    );
  }

  addCompanyClicked: EventEmitter<void> = new EventEmitter<void>();
  constructor(private http: HttpClient) {}

  getAllCompanise(): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + '/company/getAll');
  }

  getAllCompaniesIdName(): Observable<CompanyIdName[]> {
    return this.http.get<CompanyIdName[]>(
      environment.apiHost + '/company/getIdNameAll'
    );
  }

  addCompany(company: Company): Observable<Company> {
    this.addCompanyClicked.emit();
    return this.http.post<Company>(
      environment.apiHost + '/company/registerCompany',
      company
    );
  }
  getByGradeCompanies(grade: string): Observable<Company[]> {
    return this.http.get<Company[]>(
      `${environment.apiHost}/company/byGrade?grade=${grade}`
    );
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + '/company/' + id);
  }

  getByName(companyName: string): Observable<Company> {
    return this.http.get<Company>(
      environment.apiHost + '/company/name/' + companyName
    );
  }

  updateCompany(
    oldCompanyName: string,
    updatedCompany: Company
  ): Observable<void> {
    console.log(oldCompanyName);
    console.log(updatedCompany);
    return this.http.put<void>(
      environment.apiHost + '/company/update/' + oldCompanyName,
      updatedCompany
    );
  }

  getCompanyAvailableDates(
    companyId: number,
    userId: number
  ): Observable<AvailableDate[]> {
    const params = new HttpParams()
      .set('companyId', companyId.toString())
      .set('userId', userId.toString());
    return this.http.get<AvailableDate[]>(
      environment.apiHost + '/availableDate/getByCompanyId/',
      { params }
    );
  }

  getAdminAvailableDates(id: number): Observable<AvailableDate[]> {
    return this.http.get<AvailableDate[]>(
      environment.apiHost + '/availableDate/getByAdminId/' + id
    );
  }

  /*createAvailableDate(date: AvailableDate) : Observable<void>{
    return this.http.post<void>(environment.apiHost + '/availableDate/create', date);
  }*/

  getExtraAvailableDates(
    id: number,
    selectedDate: string,
    userId: number
  ): Observable<AvailableDate[]> {
    return this.http.get<AvailableDate[]>(
      environment.apiHost +
        '/availableDate/getExtraByCompanyId/' +
        id +
        '/' +
        selectedDate +
        '/' +
        userId
    );
  }

  updateAvailableDate(availableDate: AvailableDate): Observable<void> {
    return this.http.put<void>(
      environment.apiHost + '/availableDate/update',
      availableDate
    );
  }

  createAvailableDate(availableDate: AvailableDate): Observable<AvailableDate> {
    return this.http.post<AvailableDate>(
      environment.apiHost + '/availableDate/new',
      availableDate
    );
  }
  updateCompanyEquipment(
    updatedCompany: Company,
    oldId: number,
    newId: number
  ): Observable<void> {
    console.log(updatedCompany);
    return this.http.put<void>(
      `${environment.apiHost}/company/update/equipment/change/${updatedCompany.name}?oldId=${oldId}&newId=${newId}`,
      updatedCompany
    );
  }

  deleteCompanyEquipment(
    updatedCompany: Company,
    oldId: number
  ): Observable<void> {
    console.log(updatedCompany);
    return this.http.put<void>(
      `${environment.apiHost}/company/update/equipment/delete/${updatedCompany.name}?oldId=${oldId}`,
      updatedCompany
    );
  }

  addEquipmentToCompany(
    companyName: string,
    equipmentId: number
  ): Observable<any> {
    const url = `${environment.apiHost}/company/add-equipment/${companyName}/${equipmentId}`;
    return this.http.post<void>(url, null); // Assuming you just need to send a POST request
  }

  getCompanyContracts(name: String): Observable<Contract[]>{
    return this.http.get<Contract[]>(environment.apiHost + '/contract/getAllByCompanyName/'+ name);
  }

  cancelDelivery(hospitalName: String): Observable<void>{
    const url = 'http://localhost:8082/api/delivery/canceled/' + hospitalName;
    return this.http.post<void>(url, null);
  }
}
