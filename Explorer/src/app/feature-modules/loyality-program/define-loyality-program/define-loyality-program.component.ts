import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoyalityProgramService } from '../loyality-program.service';
import { LoyalityProgram } from '../model/loyalityProgramModule';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-define-loyality-program',
  templateUrl: './define-loyality-program.component.html',
  styleUrls: ['./define-loyality-program.component.css']
})
export class DefineLoyalityProgramComponent {
  defineLoyalityProgramForm: FormGroup;

  constructor(
    private loyalityProgramService: LoyalityProgramService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.defineLoyalityProgramForm = this.formBuilder.group(
      {
        nameCategory: ['', [Validators.required]],
        requiredPoints: ['', [Validators.required]],
        discount: ['', [Validators.required]],
      }
    );
  }

  defineLoyalityProgram(): void {
    if (this.defineLoyalityProgramForm.valid) {
      const loyalityProgram: LoyalityProgram = {
        nameCategory: this.defineLoyalityProgramForm.value.nameCategory || '',
        requiredPoints: this.defineLoyalityProgramForm.value.requiredPoints || 0,
        discount: this.defineLoyalityProgramForm.value.discount || 0,
      };



      this.loyalityProgramService.defineLoyalityProgram(loyalityProgram).subscribe({
        next: () => {},
        error: (error: any) => {
          
          console.error('Define failed', error);
        },
      });
    }

    this.router.navigate(['']);
  }

  
}
