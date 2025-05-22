import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministradorPerfilPage } from './administrador-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: AdministradorPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorPerfilPageRoutingModule {}
