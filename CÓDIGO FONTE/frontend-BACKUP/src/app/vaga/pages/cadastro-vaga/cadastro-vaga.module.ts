import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroVagaPageRoutingModule } from './cadastro-vaga-routing.module';

import { CadastroVagaPage } from './cadastro-vaga.page';
import { MaskitoModule } from '@maskito/angular';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaskitoModule,
    IonicModule,
    ComponentsModule,
    CadastroVagaPageRoutingModule
  ],
  declarations: [CadastroVagaPage]
})
export class CadastroVagaPageModule {}
