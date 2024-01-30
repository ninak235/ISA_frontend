import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoyalityProgram } from './model/loyalityProgramModule';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class LoyalityProgramService {

  constructor(private http: HttpClient) { }


  defineLoyalityProgram(
    defineLoyalityProgramForm: LoyalityProgram
  ): Observable<LoyalityProgram> {
    return this.http.post<LoyalityProgram>(
      environment.apiHost + '/loyalityProgram/defineLoyalityProgram',
      defineLoyalityProgramForm
    );
  }
}
