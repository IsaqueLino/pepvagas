import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfissionalDetalhesPage } from './profissional-detalhes.page';

const routes: Routes = [
  {
    path: '',
    component: ProfissionalDetalhesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfissionalDetalhesPageRoutingModule {}
