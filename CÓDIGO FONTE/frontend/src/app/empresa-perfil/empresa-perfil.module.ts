import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresaPerfilPageRoutingModule } from './empresa-perfil-routing.module';

import { EmpresaPerfilPage } from './empresa-perfil.page';
import { ComponentsModule } from '../components/components.module';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresaPerfilPageRoutingModule,
    ComponentsModule,
    MaskitoModule,
  ],
  declarations: [EmpresaPerfilPage]
})
export class EmpresaPerfilPageModule {}
