import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilAlterarPageRoutingModule } from './perfil-alterar-routing.module';

import { PerfilAlterarPage } from './perfil-alterar.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PerfilAlterarPageRoutingModule
  ],
  declarations: [PerfilAlterarPage]
})
export class PerfilPageModule {}
