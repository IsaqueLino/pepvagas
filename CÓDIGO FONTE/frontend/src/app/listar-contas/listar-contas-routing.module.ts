import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarContasPage } from './listar-contas.page';

const routes: Routes = [
  {
    path: '',
    component: ListarContasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarContasPageRoutingModule {}
