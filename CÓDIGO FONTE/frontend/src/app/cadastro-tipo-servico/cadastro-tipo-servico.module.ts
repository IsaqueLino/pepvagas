import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { CadastroTipoServicoPageRoutingModule } from './cadastro-tipo-servico-routing.module';
import { MaskitoModule } from '@maskito/angular';


import { CadastroTipoServicoPage } from './cadastro-tipo-servico.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    [FormsModule, MaskitoModule, IonicModule.forRoot({})],
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CadastroTipoServicoPageRoutingModule
  ],
  declarations: [CadastroTipoServicoPage]
})
export class CadastroTipoServicoPageModule {}
