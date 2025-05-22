import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaRepresentantesPage } from './empresa-representantes.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresaRepresentantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaRepresentantesPageRoutingModule {}
