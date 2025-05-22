import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VagasCandidatasPage } from './vagas-candidatas.page';

const routes: Routes = [
  {
    path: '',
    component: VagasCandidatasPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VagasCandidatasPageRoutingModule {}
