import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { LongLatModel } from '../company/model/longLatModel';
import { Equipment } from '../equipment/model/equipmentModel';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  
  getLocations(locations: LongLatModel[]): Observable<String> {
    return this.http.post<String>('http://localhost:8081/api/myexchange/location-simulator', locations)
  }

  sendResponse(response:String):Observable<String>{
    return this.http.post<String>('http://localhost:8080/api/contract/exchange2/response',response)
  }

}
