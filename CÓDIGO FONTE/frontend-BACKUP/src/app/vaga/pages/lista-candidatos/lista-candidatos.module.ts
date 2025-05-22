import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaCandidatosPageRoutingModule } from './lista-candidatos-routing.module';

import { ListaCandidatosPage } from './lista-candidatos.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ListaCandidatosPageRoutingModule
  ],
  declarations: [ListaCandidatosPage]
})
export class ListaCandidatosPageModule {}
