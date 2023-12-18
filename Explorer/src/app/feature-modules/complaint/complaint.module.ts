import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllComplaintComponent } from './all-complaint/all-complaint.component';
import { ReplayOnComplaintComponent } from './replay-on-complaint/replay-on-complaint.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    AllComplaintComponent,
    ReplayOnComplaintComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule, ReactiveFormsModule, MatIconModule
  ],
  exports: [AllComplaintComponent, ReplayOnComplaintComponent],
})
export class ComplaintModule { }
