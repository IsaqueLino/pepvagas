import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarContasPageRoutingModule } from './listar-contas-routing.module';

import { ListarContasPage } from './listar-contas.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ListarContasPageRoutingModule
  ],
  declarations: [ListarContasPage]
})
export class ListarContasPageModule {}
