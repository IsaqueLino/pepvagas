import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroEquipePageRoutingModule } from './cadastro-equipe-routing.module';

import { CadastroEquipePage } from './cadastro-equipe.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroEquipePageRoutingModule,
    ComponentsModule
  ],
  declarations: [CadastroEquipePage]
})
export class CadastroEquipePageModule {}
