import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from './model/companyModel';
import { environment } from 'src/env/environment';
import { CompanyIdName } from './model/companyIdName';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

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
    return this.http.put<void>(environment.apiHost + '/company/update/' + oldCompanyName, updatedCompany)
  }


}
