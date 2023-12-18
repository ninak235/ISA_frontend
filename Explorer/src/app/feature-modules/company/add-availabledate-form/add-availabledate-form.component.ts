import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'xp-add-availabledate-form',
  templateUrl: './add-availabledate-form.component.html',
  styleUrls: ['./add-availabledate-form.component.css']
})
export class AddAvailabledateFormComponent {

  selectedDate: Date; 
  //selectedTime: string;

  constructor(public dialogRef: MatDialogRef<AddAvailabledateFormComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveData(): void {
    const data = {
      selectedDate: this.selectedDate,
      //selectedTime: this.selectedTime
    };
  
    this.dialogRef.close(data);
  }
}
