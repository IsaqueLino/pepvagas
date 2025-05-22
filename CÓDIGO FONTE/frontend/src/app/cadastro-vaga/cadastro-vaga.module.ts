import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroVagaPageRoutingModule } from './cadastro-vaga-routing.module';

import { CadastroVagaPage } from './cadastro-vaga.page';
import { ComponentsModule } from '../components/components.module';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroVagaPageRoutingModule,
    ComponentsModule,
    MaskitoModule
  ],
  declarations: [CadastroVagaPage]
})
export class CadastroVagaPageModule {}
