import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarContaPage } from './recuperar-conta.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarContaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarContaPageRoutingModule {}
