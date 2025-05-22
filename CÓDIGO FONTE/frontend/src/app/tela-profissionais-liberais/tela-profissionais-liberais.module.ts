import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TelaProfissionaisLiberaisPageRoutingModule } from './tela-profissionais-liberais-routing.module';
import { TelaProfissionaisLiberaisPage } from './tela-profissionais-liberais.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TelaProfissionaisLiberaisPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [TelaProfissionaisLiberaisPage]
})
export class TelaProfissionaisLiberaisPageModule {}
