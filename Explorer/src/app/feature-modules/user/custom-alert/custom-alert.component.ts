import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
})
export class CustomAlertComponent implements OnInit {
  countdownSeconds: number = 60; // Initial countdown value

  constructor(
    public dialogRef: MatDialogRef<CustomAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    const countdownInterval = setInterval(() => {
      if (this.countdownSeconds > 0) {
        this.countdownSeconds--;
      } else {
        clearInterval(countdownInterval);
        this.onCloseClick(); // Automatically close the dialog when countdown reaches 0
      }
    }, 1000);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
