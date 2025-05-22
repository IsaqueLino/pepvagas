import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MaskitoModule } from '@maskito/angular';


import { CadastroAdministradorPageRoutingModule } from './cadastro-administrador-routing.module';

import { CadastroAdministradorPage } from './cadastro-administrador.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    [FormsModule, MaskitoModule, IonicModule.forRoot({})],
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CadastroAdministradorPageRoutingModule
  ],
  declarations: [CadastroAdministradorPage]
})
export class CadastroAdministradorPageModule {}
