import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ReplayOnComplaintComponent } from './replay-on-complaint/replay-on-complaint.component';

@NgModule({
  declarations: [
    ReplayOnComplaintComponent
  ],
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatIconModule],
  exports: [ReplayOnComplaintComponent],
})
export class ComplaintModule {}