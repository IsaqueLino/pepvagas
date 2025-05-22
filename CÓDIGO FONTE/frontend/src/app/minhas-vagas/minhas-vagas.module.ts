import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinhasVagasPageRoutingModule } from './minhas-vagas-routing.module';

import { MinhasVagasPage } from './minhas-vagas.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinhasVagasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MinhasVagasPage]
})
export class MinhasVagasPageModule {}
