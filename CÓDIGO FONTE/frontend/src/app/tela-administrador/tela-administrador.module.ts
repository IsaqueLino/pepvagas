import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TelaAdministradorPageRoutingModule } from './tela-administrador-routing.module';
import { TelaAdministradorPage } from './tela-administrador.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TelaAdministradorPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [TelaAdministradorPage]
})
export class TelaAdministradorPageModule {}
