import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaPerfilPage } from './empresa-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaPerfilPageRoutingModule {}
