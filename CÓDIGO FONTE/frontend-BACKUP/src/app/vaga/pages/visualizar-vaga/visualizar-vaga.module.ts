import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizarVagaPageRoutingModule } from './visualizar-vaga-routing.module';

import { VisualizarVagaPage } from './visualizar-vaga.page';
import { MaskitoModule } from '@maskito/angular';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaskitoModule,
    IonicModule,
    ComponentsModule,
    VisualizarVagaPageRoutingModule
  ],
  declarations: [VisualizarVagaPage]
})
export class VisualizarVagaPageModule {}
