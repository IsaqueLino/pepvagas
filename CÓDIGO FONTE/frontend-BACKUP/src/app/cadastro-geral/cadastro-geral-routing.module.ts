import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroGeralPage } from './cadastro-geral.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroGeralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroGeralPageRoutingModule {}
