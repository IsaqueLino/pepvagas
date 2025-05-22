import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarProfissionaisLiberaisPageRoutingModule } from './listar-profissionais-liberais-routing.module';

import { ListarProfissionaisLiberaisPage } from './listar-profissionais-liberais.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ListarProfissionaisLiberaisPageRoutingModule
  ],
  declarations: [ListarProfissionaisLiberaisPage]
})
export class ListarProfissionaisLiberaisPageModule {}
