import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepresentantePerfilPageRoutingModule } from './representante-perfil-routing.module';

import { RepresentantePerfilPage } from './representante-perfil.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepresentantePerfilPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RepresentantePerfilPage]
})
export class RepresentantePerfilPageModule {}
