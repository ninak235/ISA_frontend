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
import { CompanyReserveComponent } from 'src/app/feature-modules/company/company-reserve/company-reserve.component';

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
  },
  {
    path: 'registerCompanyAdmin',
    component: CompanyAdminRegistrationComponent,
  },
  { path: 'customerProfile', component: CustomerProfileComponent },
  { path: 'updateCustomerProfile/:id', component: UpdateProfileComponent},
  { path: 'allEquipments', component: AllEquipmentPreviewComponent},
  { path: 'adminProfile', component: CompanyAdminProfileComponent },
  { path: 'updateAdminProfile/:id', component: UpdateAdminProfileComponent},
  { path: 'companyProfile/:companyName', component: CompanyProfileComponent },
  { path: 'comapnyProfileReserve/:companyName', component: CompanyReserveComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
