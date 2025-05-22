import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizarVagaPage } from './visualizar-vaga.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizarVagaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizarVagaPageRoutingModule {}
