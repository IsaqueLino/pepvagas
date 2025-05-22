import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarVagaPage } from './listar-vaga.page';

const routes: Routes = [
  {
    path: '',
    component: ListarVagaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarVagaPageRoutingModule {}
