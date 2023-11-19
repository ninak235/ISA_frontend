import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { CustomerRegistrationComponent } from 'src/app/feature-modules/user/customer-registration/customer-registration.component';
import { AllCompanyPreviewComponent } from 'src/app/feature-modules/company/all-company-preview/all-company-preview.component';
import { CompanyFormComponent } from 'src/app/feature-modules/company/company-form/company-form.component';
import { CompanyAdminRegistrationComponent } from 'src/app/feature-modules/user/company-admin-registration/company-admin-registration.component';

const routes: Routes = [
  { path: '', component: AllCompanyPreviewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: CustomerRegistrationComponent },
  {
    path: 'equipment',
    component: EquipmentComponent,
    canActivate: [AuthGuard],
  },

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
