import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaCandidatosPage } from './lista-candidatos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaCandidatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaCandidatosPageRoutingModule {}
