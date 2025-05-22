import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilAlterarPageRoutingModule } from './perfil-alterar-routing.module';

import { PerfilAlterarPage } from './perfil-alterar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilAlterarPageRoutingModule
  ],
  declarations: [PerfilAlterarPage]
})
export class PerfilPageModule {}
