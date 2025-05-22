import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinhasVagasPage } from './minhas-vagas.page';

const routes: Routes = [
  {
    path: '',
    component: MinhasVagasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinhasVagasPageRoutingModule {}
