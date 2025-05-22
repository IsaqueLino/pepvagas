import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipePerfilPageRoutingModule } from './equipe-perfil-routing.module';

import { EquipePerfilPage } from './equipe-perfil.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipePerfilPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EquipePerfilPage]
})
export class EquipePerfilPageModule {}
