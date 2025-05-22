import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroTipoServicoPage } from './cadastro-tipo-servico.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroTipoServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroTipoServicoPageRoutingModule {}
