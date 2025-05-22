import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroRepresentantePageRoutingModule } from './cadastro-representante-routing.module';

import { CadastroRepresentantePage } from './cadastro-representante.page';
import { Component } from 'ionicons/dist/types/stencil-public-runtime';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroRepresentantePageRoutingModule,
    ComponentsModule
  ],
  declarations: [CadastroRepresentantePage]
})
export class CadastroRepresentantePageModule {}
