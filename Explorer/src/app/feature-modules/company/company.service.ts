import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from './model/companyModel';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getAllCompanise(): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + '/company/getAll');
  }
}
