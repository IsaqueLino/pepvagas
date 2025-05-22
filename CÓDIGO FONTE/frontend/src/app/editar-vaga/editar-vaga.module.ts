import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarVagaPageRoutingModule } from './editar-vaga-routing.module';

import { EditarVagaPage } from './editar-vaga.page';
import { ComponentsModule } from '../components/components.module';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarVagaPageRoutingModule,
    ComponentsModule,
    MaskitoModule
  ],
  declarations: [EditarVagaPage]
})
export class EditarVagaPageModule {}
