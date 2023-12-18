import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from './model/companyModel';
import { environment } from 'src/env/environment';
import { CompanyIdName } from './model/companyIdName';
import { AvailableDate } from './model/availableDateModel';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  

  getExtraAdminAvailableDates(companyName:string, adminId:number, selectedDate: string): Observable<AvailableDate[]> {
    return this.http.get<AvailableDate[]>(environment.apiHost + '/availableDate/getExtraByCompanyIdAndAdminId/'+ companyName + '/' + adminId + '/' + selectedDate);
  }

  addCompanyClicked: EventEmitter<void> = new EventEmitter<void>();
  constructor(private http: HttpClient) {}

  getAllCompanise(): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + '/company/getAll');
  }

  getAllCompaniesIdName(): Observable<CompanyIdName[]>{
    return this.http.get<CompanyIdName[]>(environment.apiHost + '/company/getIdNameAll')
  }

  addCompany(company: Company): Observable<Company>{
    console.log(company)
    this.addCompanyClicked.emit();
    return this.http.post<Company>(environment.apiHost + '/company/registerCompany', company);
  }
  getByGradeCompanies(grade: string): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.apiHost}/company/byGrade?grade=${grade}`);
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + '/company/' + id);
  }

  getByName(companyName: string): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + '/company/name/' + companyName);
  }

  updateCompany(oldCompanyName: string, updatedCompany: Company): Observable<void> {
    console.log(oldCompanyName);
    console.log(updatedCompany);
    return this.http.put<void>(environment.apiHost + '/company/update/' + oldCompanyName, updatedCompany)
  }

  getCompanyAvailableDates(id: number): Observable<AvailableDate[]>{
    return this.http.get<AvailableDate[]>(environment.apiHost + '/availableDate/getByCompanyId/'+id);
  }

  /*createAvailableDate(date: AvailableDate) : Observable<void>{
    return this.http.post<void>(environment.apiHost + '/availableDate/create', date);
  }*/

  getExtraAvailableDates(id:number, selectedDate: string): Observable<AvailableDate[]> {
    return this.http.get<AvailableDate[]>(environment.apiHost + '/availableDate/getExtraByCompanyId/'+id + '/' + selectedDate);
  }

  updateAvailableDate(availableDate: AvailableDate): Observable<void>{
    return this.http.put<void>(environment.apiHost + '/availableDate/update', availableDate);
  }

  createAvailableDate(availableDate: AvailableDate): Observable<AvailableDate>{
    return this.http.post<AvailableDate>(environment.apiHost + '/availableDate/new', availableDate);
  }
  updateCompanyEquipment(updatedCompany: Company, oldId: number, newId: number): Observable<void> {
    console.log(updatedCompany);
    return this.http.put<void>(
        `${environment.apiHost}/company/update/equipment/change/${updatedCompany.name}?oldId=${oldId}&newId=${newId}`,
        updatedCompany
    );
  }

  deleteCompanyEquipment(updatedCompany: Company, oldId: number): Observable<void> {
    console.log(updatedCompany);
    return this.http.put<void>(
        `${environment.apiHost}/company/update/equipment/delete/${updatedCompany.name}?oldId=${oldId}`,
        updatedCompany
    );
  }

  addEquipmentToCompany(companyName: string, equipmentId: number): Observable<any> {
    const url = `${environment.apiHost}/company/add-equipment/${companyName}/${equipmentId}`;
    return this.http.post<void>(url, null); // Assuming you just need to send a POST request
  }
  


}
