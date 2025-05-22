import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelaProfissionaisLiberaisPage } from './tela-profissionais-liberais.page';

const routes: Routes = [
  {
    path: '',
    component: TelaProfissionaisLiberaisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TelaProfissionaisLiberaisPageRoutingModule {}
