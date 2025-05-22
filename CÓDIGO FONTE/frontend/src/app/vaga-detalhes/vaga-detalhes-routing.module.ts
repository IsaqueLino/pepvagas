import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VagaDetalhesPage } from './vaga-detalhes.page';

const routes: Routes = [
  {
    path: '',
    component: VagaDetalhesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VagaDetalhesPageRoutingModule {}
