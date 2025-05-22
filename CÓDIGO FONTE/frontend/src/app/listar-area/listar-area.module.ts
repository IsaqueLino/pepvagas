import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { ListarAreaPageRoutingModule } from './listar-area-routing.module';

import { ListarAreaPage } from './listar-area.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    [FormsModule, IonicModule.forRoot({})],
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ListarAreaPageRoutingModule
  ],
  declarations: [ListarAreaPage]
})
export class ListarAreaPageModule {}
