import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroEquipePage } from './cadastro-equipe.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroEquipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroEquipePageRoutingModule {}
