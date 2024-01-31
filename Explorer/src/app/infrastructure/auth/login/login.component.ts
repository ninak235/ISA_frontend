import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { User } from '../model/user.model';
import { SystemUser } from 'src/app/feature-modules/user/model/user.model';
import { UserService } from 'src/app/feature-modules/user/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomAlertComponent } from 'src/app/feature-modules/user/custom-alert/custom-alert.component';

@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {}
  user: User;
  systemAdmin: SystemUser;
  showAlert: boolean = false;

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.userName || '',
      password: this.loginForm.value.password || '',
    };

    if (this.loginForm.valid) {
      this.authService.login(login).subscribe({
        next: () => {
          this.authService.user$.subscribe((user) => {
            this.user = user;

            // Set the current user in the UserService
            //this.userService.setCurrentUser(this.user);

            if (
              this.user.role.roles.includes('ROLE_ADMIN') ||
              this.user.role.roles.includes('ROLE_COMPANYADMIN')
            ) {
              this.userService
                .getUserById(this.user.id)
                .subscribe((systemAdmin) => {
                  this.systemAdmin = systemAdmin;
                  console.log(this.systemAdmin);
                  console.log(this.user.role);
                  if (
                    !this.systemAdmin.firstLogin &&
                    (this.user.role.roles.includes('ROLE_ADMIN') ||
                      this.user.role.roles.includes('ROLE_COMPANYADMIN'))
                  ) {
                    this.router.navigate(['/changeSystemAdmin']);
                  } else if (
                    this.user.role.roles.includes('ROLE_COMPANYADMIN')
                  ) {
                    this.router.navigate(['/companyProfile']);
                  } else {
                    this.router.navigate(['/']);
                  }
                });
            } else {
              this.router.navigate(['/']);
            }
            // Continue with the rest of the logic
          });
        },
        error: (error) => {
          console.error('Login failed:', error);

          if (error.status == 401) {
            this.openCustomAlert('Wrong password or username!');
          } else if (error.status === 429) {
            this.openCustomAlert(
              'TOO MANY REQUESTS: Please wait for a minute and try again later!'
            );
          }
        },
      });
    }
  }

  openCustomAlert(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '300px'; // Adjust the width as needed
    dialogConfig.data = { message: message };

    const dialogRef = this.dialog.open(CustomAlertComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
