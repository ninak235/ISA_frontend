import { Injectable } from '@angular/core';
import { Equipment } from './model/equipmentModel';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { HttpClient } from '@angular/common/http';
import { CompanyEquipment, TypeOfEquipment } from '../company/model/companyModel';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient) { }

  getAllEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + '/equipment/getAll');
  }

  getByGradeEquipment(grade: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${environment.apiHost}/equipment/byGrade?grade=${grade}`);
  }

  getByTypeEquipment(typeOfEquipment: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${environment.apiHost}/equipment/byType?typeOfEquipment=${typeOfEquipment}`);
  }

  addEquipment(equipment: CompanyEquipment): Observable<Equipment>{
    console.log(equipment)
    return this.http.post<Equipment>(environment.apiHost + '/equipment', equipment);
  }

}
