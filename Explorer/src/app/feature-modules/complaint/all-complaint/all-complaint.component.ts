import { Component } from '@angular/core';
import { Complaint } from '../model/complaintModel';
import { ComplaintService } from '../complaint.service';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-all-complaint',
  templateUrl: './all-complaint.component.html',
  styleUrls: ['./all-complaint.component.css']
})
export class AllComplaintComponent {
  renderReplayOnComplaint: boolean = false;
  complaints: Complaint[] = [];
  selectedComplaint: Complaint;

  constructor(private complaintService: ComplaintService, private router: Router) { }

  ngOnInit(): void {
    this.refreshCompanyList();

    this.complaintService.replayOnComplaintClicked.subscribe(() => {
      this.refreshCompanyList();
    });
  }

  refreshCompanyList(): void {
    this.complaintService.getAllComplaints().subscribe({
      next: (result: Complaint[]) => {
        // Initialize the disabled property for each complaint
        this.complaints = result.map(complaint => ({ ...complaint, disabled: false }));
        console.log(this.complaints);
      },
      error: (error: any) => {
        console.error('Error loading complaints', error);
      },
    });
  }

  onReplayOnComplaint(complaint: Complaint): void {
    this.renderReplayOnComplaint = true;
    complaint.disabled = true;
    this.selectedComplaint = complaint;

    // Optional: You might want to disable other buttons that are not related to this complaint.
    this.complaints = this.complaints.map(c => (c.id === complaint.id ? { ...c, disabled: true } : c)) as Complaint[];

    // Fetch the updated list of complaints (if needed)
    this.complaintService.getAllComplaints().subscribe({
        next: (result: Complaint[]) => {
            // Update the list of complaints and disable the corresponding buttons
            this.complaints = result.map(c => ({ ...c, disabled: this.complaints.find(oldC => oldC.id === c.id)?.disabled})) as Complaint[];;
        },
        error: (error: any) => {
            console.error('Error loading complaints', error);
        },
    });
}

  // Add this method
  onReplayOnComplaintClicked(): void {
    this.renderReplayOnComplaint = false;
  }

  navigateToUserProfile() {
    this.router.navigate(['/userProfile']);
  }
}
