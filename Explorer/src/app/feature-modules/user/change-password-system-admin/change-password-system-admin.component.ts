import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { SystemUser } from '../model/user.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Login } from 'src/app/infrastructure/auth/model/login.model';

@Component({
  selector: 'xp-change-password-system-admin',
  templateUrl: './change-password-system-admin.component.html',
  styleUrls: ['./change-password-system-admin.component.css']
})
export class ChangePasswordSystemAdminComponent {
  registrationAdminForm: FormGroup;
  @Input() systemAdmin: SystemUser;
  user: User;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registrationAdminForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.confirmPasswordValidator],
      }
    );
  }

  /*
  ngOnInit(): void {
    // Retrieve the user data from the router state
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {
      
    } else {
      console.error('User data is missing.');
    }
  }*/

  updateProfile(): void {
    // Step 1: Get the user from the AuthService
    this.authService.user$.subscribe((user) => {
      if (!user) {
        console.error('User is undefined.');
        return;
      }
  
      this.user = user;
  
      // Step 2: Fetch additional information using UserService
      this.userService.getUserById(this.user.id).subscribe((systemAdmin) => {
        this.systemAdmin = systemAdmin;
  
        // Step 3: Update the profile
        const updatedAdmin: SystemUser = {
          id: this.user.id || 3,
          firstName: this.systemAdmin?.firstName || '',
          lastName: this.systemAdmin?.lastName || '',
          password: this.registrationAdminForm.value.password || '',
          userName: this.systemAdmin?.userName || '',
          email: this.systemAdmin?.email || '',
          country: this.systemAdmin?.country || '',
          city: this.systemAdmin?.city || '',
          number: this.systemAdmin?.number || '',
          firstLogin: true,
        };
  
        // Step 4: Update the password first
        this.userService.updateSystemAdminPassword(updatedAdmin).subscribe({
          next: () => {
                // Step 6: Continue with any additional logic or navigation
                this.registrationAdminForm.reset();
                if(this.user.role.roles.includes("ROLE_COMPANYADMIN")){
                  this.router.navigate(['/companyProfile']);
                }else{
                  this.router.navigate(['/']);
                }
          },
        });
      });
    });
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
