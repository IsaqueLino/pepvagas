import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarAreaPage } from './listar-area.page';

const routes: Routes = [
  {
    path: '',
    component: ListarAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarAreaPageRoutingModule {}
