import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Complaint } from '../model/complaintModel';
import { ComplaintService } from '../complaint.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-replay-on-complaint',
  templateUrl: './replay-on-complaint.component.html',
  styleUrls: ['./replay-on-complaint.component.css']
})
export class ReplayOnComplaintComponent {
  @Output() replayOnComplaintClicked = new EventEmitter<void>();
  renderUpdateComplaint: boolean = true;
  @Input() complaint: Complaint;
  constructor(private service: ComplaintService){
  }

  complaintForm = new FormGroup({
    replay: new FormControl('', [Validators.required]),
  });

  ngOnChanges(changes: SimpleChanges):void {
    this.complaintForm.reset();
    this.renderUpdateComplaint = true;
    if(this.renderUpdateComplaint){
      this.complaintForm.patchValue(this.complaint);
    }

  }

  
  

  updateComplaint() : void{
    if (!this.complaint) {
      console.error('Complaint is undefined');
      return;
    }

    const updatedComplaint: Complaint = {
      replay: this.complaintForm.value.replay || '',
      content: this.complaint.content || '',
      id: this.complaint.id || 0,
      disabled: this.complaint.disabled || false,
    };

    console.log("Updatovana:", updatedComplaint);
  
    this.service.updateComplaint(updatedComplaint).subscribe({
      next: () => {
        this.renderUpdateComplaint = false;
        this.replayOnComplaintClicked
      },
      error: (error: any) => {
        console.error('Error adding company', error);
      },
    });
  }
}
