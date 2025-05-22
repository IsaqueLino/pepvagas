import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipePerfilPage } from './equipe-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: EquipePerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipePerfilPageRoutingModule {}
