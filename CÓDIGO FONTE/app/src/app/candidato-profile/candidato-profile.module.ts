import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatoProfilePageRoutingModule } from './candidato-profile-routing.module';

import { CandidatoProfilePage } from './candidato-profile.page';
import { MaskitoModule } from '@maskito/angular';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidatoProfilePageRoutingModule,
    MaskitoModule,
    ComponentsModule
  ],
  declarations: [CandidatoProfilePage]
})
export class CandidatoProfilePageModule {}
