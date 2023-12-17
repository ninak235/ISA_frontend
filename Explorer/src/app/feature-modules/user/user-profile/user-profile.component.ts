import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user.model';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  user: User;
  renderReplayOnComplaint: boolean = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserById(3).subscribe({
      next: (u: User) => {
        this.user = u;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onReplayOnComplaint() : void{
      this.renderReplayOnComplaint = true;
  
      this.userService.getUserById(4).subscribe({
      next: (u: User) => {
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
