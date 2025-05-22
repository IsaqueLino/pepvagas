import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';
import { MaskitoModule } from '@maskito/angular';


import { PerfilProfissionalLiberalPageRoutingModule } from './perfil-profissional-liberal-routing.module';

import { PerfilProfissionalLiberalPage } from './perfil-profissional-liberal.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    [FormsModule, MaskitoModule, IonicModule.forRoot({})],
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PerfilProfissionalLiberalPageRoutingModule
  ],
  declarations: [PerfilProfissionalLiberalPage]
})
export class PerfilProfissionalLiberalPageModule {}
