import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { VagasCandidatasPage } from './vagas-candidatas.page';

import { VagasCandidatasPageRoutingModule } from './vagas-candidatas-routing.module';
import { ComponentsModule } from '../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VagasCandidatasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [VagasCandidatasPage]
})
export class VagasCandidatasPageModule {}
