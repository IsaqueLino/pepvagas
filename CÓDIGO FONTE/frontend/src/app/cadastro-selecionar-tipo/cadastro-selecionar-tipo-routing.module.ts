import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroSelecionarTipoPage } from './cadastro-selecionar-tipo.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroSelecionarTipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroSelecionarTipoPageRoutingModule {}
