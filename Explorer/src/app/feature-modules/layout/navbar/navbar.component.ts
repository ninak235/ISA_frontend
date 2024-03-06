import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  systemAdmin: boolean = false;
  customer: boolean = false;
  companyAdmin: boolean = false;
  user: User | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if(this.user.role.roles.includes("ROLE_ADMIN")){
        this.systemAdmin = true;
        this.companyAdmin = false;
        this.customer = false;
      }
      else if(this.user.role.roles.includes("ROLE_COMPANYADMIN")){
        this.companyAdmin = true;
        this.systemAdmin = false;
        this.customer = false;
      }
      else if(this.user.role.roles.includes("ROLE_CUSTOMER")){
        this.customer = true;
        this.companyAdmin = false;
        this.systemAdmin = false;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
