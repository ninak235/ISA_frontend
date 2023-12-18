import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { SystemUser } from '../model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  user: SystemUser;
  id: number;
  renderReplayOnComplaint: boolean = false;
  constructor(private userService: UserService,private authService: AuthService) { }

  ngOnInit(): void {
    this.id = this.authService.user$.getValue().id;
    this.userService.getUserById(this.id).subscribe({
      next: (u: SystemUser) => {
        this.user = u;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onReplayOnComplaint() : void{
      this.renderReplayOnComplaint = true;
      this.id = this.authService.user$.getValue().id;
      this.userService.getUserById(this.id).subscribe({
      next: (u: SystemUser) => {
        this.user = u;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onReplayOnComplaintClicked(): void {
    this.renderReplayOnComplaint = true;
  }
}
