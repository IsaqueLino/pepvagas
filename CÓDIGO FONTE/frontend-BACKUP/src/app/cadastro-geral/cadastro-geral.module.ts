import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroGeralPageRoutingModule } from './cadastro-geral-routing.module';

import { CadastroGeralPage } from './cadastro-geral.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CadastroGeralPageRoutingModule,

  ],
  declarations: [CadastroGeralPage, CadastroGeralPage]
})
export class CadastroGeralPageModule {}
