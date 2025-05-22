import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarVagaPage } from './editar-vaga.page';

const routes: Routes = [
  {
    path: '',
    component: EditarVagaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarVagaPageRoutingModule {}
