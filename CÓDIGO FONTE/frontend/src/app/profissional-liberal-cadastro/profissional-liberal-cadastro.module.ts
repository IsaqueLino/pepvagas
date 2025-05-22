import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MaskitoModule } from '@maskito/angular';


import { ProfissionalLiberalCadastroPageRoutingModule } from './profissional-liberal-cadastro-routing.module';

import { ProfissionalLiberalCadastroPage } from './profissional-liberal-cadastro.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    [FormsModule, MaskitoModule, IonicModule.forRoot({})],
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProfissionalLiberalCadastroPageRoutingModule
  ],
  declarations: [ProfissionalLiberalCadastroPage]
})
export class ProfissionalLiberalCadastroPageModule {}
