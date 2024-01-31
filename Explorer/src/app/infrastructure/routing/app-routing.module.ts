import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { CustomerRegistrationComponent } from 'src/app/feature-modules/user/customer-registration/customer-registration.component';
import { AllCompanyPreviewComponent } from 'src/app/feature-modules/company/all-company-preview/all-company-preview.component';
import { CompanyFormComponent } from 'src/app/feature-modules/company/company-form/company-form.component';
import { CompanyAdminRegistrationComponent } from 'src/app/feature-modules/user/company-admin-registration/company-admin-registration.component';
import { CustomerProfileComponent } from 'src/app/feature-modules/user/customer-profile/customer-profile.component';
import { UpdateProfileComponent } from 'src/app/feature-modules/user/update-profile/update-profile.component';
import { AllEquipmentPreviewComponent } from 'src/app/feature-modules/equipment/all-equipment-preview/all-equipment-preview.component';
import { CompanyAdminProfileComponent } from 'src/app/feature-modules/user/company-admin-profile/company-admin-profile.component';
import { UpdateAdminProfileComponent } from 'src/app/feature-modules/user/update-admin-profile/update-admin-profile.component';
import { CompanyProfileComponent } from 'src/app/feature-modules/company/company-profile/company-profile.component';
import { SystemAdminCreateComponent } from 'src/app/feature-modules/user/system-admin-create/system-admin-create.component';
import { UserProfileComponent } from 'src/app/feature-modules/user/user-profile/user-profile.component';
import { AllComplaintComponent } from 'src/app/feature-modules/complaint/all-complaint/all-complaint.component';
import { AllReservationsComponent } from 'src/app/feature-modules/reservation/all-reservations/all-reservations.component';
import { ChangePasswordSystemAdminComponent } from 'src/app/feature-modules/user/change-password-system-admin/change-password-system-admin.component';
import { CompanyReserveComponent } from 'src/app/feature-modules/company/company-reserve/company-reserve.component';
import { DefineLoyalityProgramComponent } from 'src/app/feature-modules/loyality-program/define-loyality-program/define-loyality-program.component';
import { CustomerGuard } from '../auth/customer.guard';
import { PositionSimulatorComponent } from 'src/app/feature-modules/administration/position-simulator/position-simulator.component';
import { CompanyAdminHomeComponent } from 'src/app/feature-modules/company/company-admin-home/company-admin-home.component';
import { CompanyCustomersComponent } from 'src/app/feature-modules/company/company-customers/company-customers.component';
import { CompanyAdminGuard } from '../auth/companyAdmin.guard';
import { AdminGuard } from '../auth/admin.guard';

const routes: Routes = [
  { path: '', component: AllCompanyPreviewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: CustomerRegistrationComponent },

  {
    path: 'allCompanies',
    component: AllCompanyPreviewComponent,
  },
  {
    path: 'addCompany',
    component: CompanyFormComponent,
    canActivate: [AdminGuard],

  },
  {
    path: 'registerCompanyAdmin',
    component: CompanyAdminRegistrationComponent,
    canActivate: [AdminGuard],

  },
  {
    path: 'customerProfile',
    component: CustomerProfileComponent,
    canActivate: [CustomerGuard],
  },
  { path: 'updateCustomerProfile/:id', component: UpdateProfileComponent,  canActivate: [CustomerGuard], },
  { path: 'allEquipments', component: AllEquipmentPreviewComponent },
  { path: 'adminProfile', component: CompanyAdminProfileComponent,  canActivate: [CompanyAdminGuard], },
  { path: 'updateAdminProfile/:id', component: UpdateAdminProfileComponent, canActivate: [CompanyAdminGuard], },
  { path: 'companyProfile', component: CompanyProfileComponent, canActivate: [CompanyAdminGuard], },
  { path: 'createSystemAdmin', component: SystemAdminCreateComponent, canActivate: [AdminGuard],  },
  { path: 'userProfile', component: UserProfileComponent, canActivate: [AdminGuard],  },
  { path: 'allCompaints', component: AllComplaintComponent },
  { path: 'allReservations', component: AllReservationsComponent, canActivate: [CompanyAdminGuard],  },
  { path: 'changeSystemAdmin', component: ChangePasswordSystemAdminComponent},
  { path: 'comapnyProfileReserve/:companyName', component: CompanyReserveComponent, canActivate: [CustomerGuard], },
  { path: 'defineLoyalityProgram', component: DefineLoyalityProgramComponent, canActivate: [AdminGuard],  },
  { path: 'positionSimulator', component: PositionSimulatorComponent, canActivate: [CompanyAdminGuard],  },
  { path: 'companyCustomers', component: CompanyCustomersComponent, canActivate: [CompanyAdminGuard], }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
