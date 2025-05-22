import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelaAdministradorPage } from './tela-administrador.page';

const routes: Routes = [
  {
    path: '',
    component: TelaAdministradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TelaAdministradorPageRoutingModule {}
