import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroRepresentantePage } from './cadastro-representante.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroRepresentantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRepresentantePageRoutingModule {}
