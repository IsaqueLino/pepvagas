import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministradorPerfilPageRoutingModule } from './administrador-perfil-routing.module';

import { AdministradorPerfilPage } from './administrador-perfil.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministradorPerfilPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AdministradorPerfilPage]
})
export class AdministradorPerfilPageModule {}
