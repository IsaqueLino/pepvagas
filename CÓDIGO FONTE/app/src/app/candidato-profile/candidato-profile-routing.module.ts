import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatoProfilePage } from './candidato-profile.page';

const routes: Routes = [
  {
    path: '',
    component: CandidatoProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatoProfilePageRoutingModule {}
