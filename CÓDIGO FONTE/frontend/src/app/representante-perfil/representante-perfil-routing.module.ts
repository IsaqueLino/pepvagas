import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepresentantePerfilPage } from './representante-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: RepresentantePerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepresentantePerfilPageRoutingModule {}
