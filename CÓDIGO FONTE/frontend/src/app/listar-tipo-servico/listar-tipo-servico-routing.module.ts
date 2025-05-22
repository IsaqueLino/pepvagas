import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarTipoServicoPage } from './listar-tipo-servico.page';

const routes: Routes = [
  {
    path: '',
    component: ListarTipoServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarTipoServicoPageRoutingModule {}
