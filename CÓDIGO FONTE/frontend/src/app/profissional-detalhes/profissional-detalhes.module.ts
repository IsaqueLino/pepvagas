import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfissionalDetalhesPageRoutingModule } from './profissional-detalhes-routing.module';
import { ProfissionalDetalhesPage } from './profissional-detalhes.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfissionalDetalhesPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [ProfissionalDetalhesPage]
})
export class ProfissionalDetalhesPageModule {}
