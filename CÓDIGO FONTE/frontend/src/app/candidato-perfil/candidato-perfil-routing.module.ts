import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatoPerfilPage } from './candidato-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: CandidatoPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatoPerfilPageRoutingModule {}
