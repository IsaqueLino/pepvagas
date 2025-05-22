import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresaRepresentantesPageRoutingModule } from './empresa-representantes-routing.module';

import { EmpresaRepresentantesPage } from './empresa-representantes.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresaRepresentantesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EmpresaRepresentantesPage]
})
export class EmpresaRepresentantesPageModule {}
