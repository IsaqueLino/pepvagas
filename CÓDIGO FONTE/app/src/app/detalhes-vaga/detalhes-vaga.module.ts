import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhesVagaRoutingModule } from './detalhes-vaga-routing.module';

import { DetalhesVaga } from './detalhes-vaga.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesVagaRoutingModule,
    ComponentsModule
  ],
  declarations: [DetalhesVaga]
})
export class DetalhesVagaModule {}
