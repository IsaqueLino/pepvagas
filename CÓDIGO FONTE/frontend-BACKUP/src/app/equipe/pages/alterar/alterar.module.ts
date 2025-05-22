import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlterarPageRoutingModule } from './alterar-routing.module';

import { AlterarPage } from './alterar.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AlterarPageRoutingModule
  ],
  declarations: [AlterarPage]
})
export class AlterarPageModule {}
