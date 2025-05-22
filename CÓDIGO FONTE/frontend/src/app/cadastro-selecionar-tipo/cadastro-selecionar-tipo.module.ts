import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroSelecionarTipoPageRoutingModule } from './cadastro-selecionar-tipo-routing.module';

import { CadastroSelecionarTipoPage } from './cadastro-selecionar-tipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroSelecionarTipoPageRoutingModule
  ],
  declarations: [CadastroSelecionarTipoPage]
})
export class CadastroSelecionarTipoPageModule {}
