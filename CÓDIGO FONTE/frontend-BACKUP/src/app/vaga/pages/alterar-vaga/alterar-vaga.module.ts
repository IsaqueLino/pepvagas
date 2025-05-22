import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlterarVagaPageRoutingModule } from './alterar-vaga-routing.module';

import { AlterarVagaPage } from './alterar-vaga.page';
import { MaskitoModule } from '@maskito/angular';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaskitoModule,
    IonicModule,
    ComponentsModule,
    AlterarVagaPageRoutingModule
  ],
  declarations: [AlterarVagaPage]
})
export class AlterarVagaPageModule {}
