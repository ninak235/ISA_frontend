import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Complaint } from './model/complaintModel';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  replayOnComplaintClicked: EventEmitter<void> = new EventEmitter<void>();
  constructor(private http: HttpClient) {}

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(environment.apiHost + '/complaint/getAll');
  }

  updateComplaint(complaint: Complaint): Observable<void> {
    return this.http.put<void>(environment.apiHost + '/complaint/update', complaint);
  }

  createCompaint(complaint: Complaint): Observable<Complaint>{
    return this.http.post<Complaint>(environment.apiHost + '/complaint/new', complaint)
  }
  
}
