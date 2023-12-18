import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { SystemUser } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-system-admin-create',
  templateUrl: './system-admin-create.component.html',
  styleUrls: ['./system-admin-create.component.css']
})
export class SystemAdminCreateComponent {
  registrationAdminForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registrationAdminForm = this.formBuilder.group(
      { 
        firstName: ['', [Validators.required]],
        userName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
        number: ['', [Validators.required]],
      },
      {
        validators: [this.confirmPasswordValidator],
      }
    );  
  }

  

  register(): void {
    if (this.registrationAdminForm.valid) {
      const registration: SystemUser = {
        firstName: this.registrationAdminForm.value.firstName || '',
        userName: this.registrationAdminForm.value.userName || '',
        lastName: this.registrationAdminForm.value.lastName || '',
        email: this.registrationAdminForm.value.email || '',
        password: this.registrationAdminForm.value.password || '',
        country: this.registrationAdminForm.value.country || '',
        city: this.registrationAdminForm.value.city || '',
        number: this.registrationAdminForm.value.number || '',
        firstLogin: false,
      };



      this.userService.registerSystemAdmin(registration).subscribe({
        next: () => {
          this.router.navigate(['/userProfile']);
        },
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
