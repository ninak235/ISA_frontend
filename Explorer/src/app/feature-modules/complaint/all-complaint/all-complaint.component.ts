// all-complaint.component.ts
import { Component, NgModule } from '@angular/core';
import { Complaint } from '../model/complaint.model';
import { ComplaintService } from '../complaint.service';

@Component({
  selector: 'xp-all-complaint',
  templateUrl: './all-complaint.component.html',
  styleUrls: ['./all-complaint.component.css']
})
export class AllComplaintComponent {
  renderReplayOnComplaint: boolean = false;
  complaints: Complaint[] = [];

  constructor(private complaintService: ComplaintService) { }

  ngOnInit(): void {
    this.refreshCompanyList();
  }

  refreshCompanyList(): void {
    this.complaintService.getAllComplaints().subscribe({
      next: (result: Complaint[]) => {
        this.complaints = result;
        console.log(this.complaints);
      },
      error: (error: any) => {
        console.error('Error loading complaints', error);
      },
    });
  }

  onReplayOnComplaint(): void {
    this.renderReplayOnComplaint = true;

    // Add logic for replaying on complaint if needed
  }

  onReplayOnComplaintClicked(): void {
    this.renderReplayOnComplaint = false;
  }
}
