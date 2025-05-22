import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarTipoServicoPageRoutingModule } from './listar-tipo-servico-routing.module';

import { ListarTipoServicoPage } from './listar-tipo-servico.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    [FormsModule, IonicModule.forRoot({})],
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ListarTipoServicoPageRoutingModule
  ],
  declarations: [ListarTipoServicoPage]
})
export class ListarTipoServicoPageModule {}
