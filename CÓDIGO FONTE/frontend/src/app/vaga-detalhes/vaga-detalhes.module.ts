import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VagaDetalhesPageRoutingModule } from './vaga-detalhes-routing.module';
import { VagaDetalhesPage } from './vaga-detalhes.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VagaDetalhesPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [VagaDetalhesPage]
})
export class VagaDetalhesPageModule {}
