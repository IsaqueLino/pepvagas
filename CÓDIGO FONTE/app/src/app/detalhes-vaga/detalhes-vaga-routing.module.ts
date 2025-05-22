import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesVaga } from './detalhes-vaga.page';

const routes: Routes = [
  {
    path: '',
    component: DetalhesVaga
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesVagaRoutingModule {}
