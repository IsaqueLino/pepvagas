import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfissionalLiberalCadastroPage } from './profissional-liberal-cadastro.page';

const routes: Routes = [
  {
    path: '',
    component: ProfissionalLiberalCadastroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfissionalLiberalCadastroPageRoutingModule {}
