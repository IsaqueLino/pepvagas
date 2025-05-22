import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlterarVagaPage } from './alterar-vaga.page';

const routes: Routes = [
  {
    path: '',
    component: AlterarVagaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlterarVagaPageRoutingModule {}
