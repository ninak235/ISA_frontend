import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllEquipmentPreviewComponent } from './all-equipment-preview/all-equipment-preview.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AllEquipmentPreviewComponent
  ],
  imports: [
    CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule
  ],
  exports: [AllEquipmentPreviewComponent],
})
export class EquipmentModule { }
