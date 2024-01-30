import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefineLoyalityProgramComponent } from './define-loyality-program/define-loyality-program.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';  // Make sure to include this line


@NgModule({
  declarations: [
    DefineLoyalityProgramComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ]
})
export class LoyalityProgramModule { }
