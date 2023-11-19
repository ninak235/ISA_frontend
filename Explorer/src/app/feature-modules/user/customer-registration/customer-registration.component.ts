import { Component } from '@angular/core';
import { Customer } from '../model/customer.model';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'xp-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css'],
})
export class CustomerRegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.registrationForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
        number: ['', [Validators.required]],
        occupation: ['', [Validators.required]],
        companyInfo: ['', [Validators.required]],
      },
      {
        validators: [this.confirmPasswordValidator],
      }
    );
  }

  register(): void {
    if (this.registrationForm.valid) {
      const registration: Customer = {
        firstName: this.registrationForm.value.firstName || '',
        lastName: this.registrationForm.value.lastName || '',
        email: this.registrationForm.value.email || '',
        password: this.registrationForm.value.password || '',
        country: this.registrationForm.value.country || '',
        city: this.registrationForm.value.city || '',
        number: this.registrationForm.value.number || '',
        occupation: this.registrationForm.value.occupation || '',
        companyInfo: this.registrationForm.value.companyInfo || '',
        penaltyPoints: 0
      };

      this.userService.registerCustomer(registration).subscribe({
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
