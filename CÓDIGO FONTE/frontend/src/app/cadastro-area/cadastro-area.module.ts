import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MaskitoModule } from '@maskito/angular';


import { CadastroAreaPageRoutingModule } from './cadastro-area-routing.module';

import { CadastroAreaPage } from './cadastro-area.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    [FormsModule, MaskitoModule, IonicModule.forRoot({})],
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CadastroAreaPageRoutingModule
  ],
  declarations: [CadastroAreaPage]
})
export class CadastroAreaPageModule {}
