import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Complaint } from './model/complaint.model';
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
}
