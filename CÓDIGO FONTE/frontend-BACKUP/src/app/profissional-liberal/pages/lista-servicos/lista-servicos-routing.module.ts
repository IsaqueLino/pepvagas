import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaServicosPage } from './lista-servicos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaServicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaServicosPageRoutingModule {}
