import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroVagaPage } from './cadastro-vaga.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroVagaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroVagaPageRoutingModule {}
