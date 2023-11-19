import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { CompanyAdminRegistration } from '../model/companyAdminModel';
import { CompanyService } from '../../company/company.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'xp-company-admin-registration',
  templateUrl: './company-admin-registration.component.html',
  styleUrls: ['./company-admin-registration.component.css']
})
export class CompanyAdminRegistrationComponent {
  registrationAdminForm: FormGroup;
  companyNames: { id: number; name: string; }[];

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private formBuilder: FormBuilder
  ) {
    this.registrationAdminForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
        number: ['', [Validators.required]],
        selectedCompany: ['']
      },
      {
        validators: [this.confirmPasswordValidator],
      }
    );

    this.companyService.getAllCompaniesIdName().subscribe({
      next: (result: { id: number; name: string }[]) => {
        this.companyNames = result;
      },
      error: (error: any) => {
        console.error('Error getting company names', error);
      },
    });    
  }

  

  register(): void {
    if (this.registrationAdminForm.valid) {
      const registration: CompanyAdminRegistration = {
        firstName: this.registrationAdminForm.value.firstName || '',
        lastName: this.registrationAdminForm.value.lastName || '',
        email: this.registrationAdminForm.value.email || '',
        password: this.registrationAdminForm.value.password || '',
        country: this.registrationAdminForm.value.country || '',
        city: this.registrationAdminForm.value.city || '',
        number: this.registrationAdminForm.value.number || '',
        companyId: parseInt(this.registrationAdminForm.value.selectedCompany) || 0,
      };
      console.log("cJONCOJENO", registration)



      this.userService.registerCompanyAdmin(registration).subscribe({
        next: () => {},
        error: (error: any) => {
          console.error('Registration failed', error);
        },
      });
    }
  }

  confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    const mismatch = password === confirmPassword;

    if (!mismatch) {
      control.get('confirmPassword')?.setErrors({ PasswordNoMatch: true });
    }

    return mismatch ? null : { PasswordNoMatch: true };
  };
}
