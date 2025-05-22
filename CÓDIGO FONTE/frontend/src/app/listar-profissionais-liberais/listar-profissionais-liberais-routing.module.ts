import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarProfissionaisLiberaisPage } from './listar-profissionais-liberais.page';

const routes: Routes = [
  {
    path: '',
    component: ListarProfissionaisLiberaisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarProfissionaisLiberaisPageRoutingModule {}
