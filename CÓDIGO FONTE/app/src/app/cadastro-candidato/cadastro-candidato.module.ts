import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroCandidatoPageRoutingModule } from './cadastro-candidato-routing.module';

import { CadastroCandidatoPage } from './cadastro-candidato.page';

import { MaskitoModule } from '@maskito/angular';


@NgModule({
  imports: [
    [FormsModule, MaskitoModule, IonicModule.forRoot({})],
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroCandidatoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadastroCandidatoPage]
})
export class CadastroCandidatoPageModule {}