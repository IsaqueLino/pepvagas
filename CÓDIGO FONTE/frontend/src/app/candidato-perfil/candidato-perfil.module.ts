import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatoPerfilPageRoutingModule } from './candidato-perfil-routing.module';

import { CandidatoPerfilPage } from './candidato-perfil.page';
import { MaskitoModule } from '@maskito/angular';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidatoPerfilPageRoutingModule,
    MaskitoModule,
    ComponentsModule
  ],
  declarations: [CandidatoPerfilPage]
})
export class CandidatoPerfilPageModule {}
