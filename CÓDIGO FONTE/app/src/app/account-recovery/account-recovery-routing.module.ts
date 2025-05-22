import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountRecoveryPage } from './account-recovery.page';

const routes: Routes = [
  {
    path: '',
    component: AccountRecoveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRecoveryPageRoutingModule {}
