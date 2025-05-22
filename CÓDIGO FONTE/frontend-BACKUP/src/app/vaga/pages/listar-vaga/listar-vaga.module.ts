import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarVagaPageRoutingModule } from './listar-vaga-routing.module';

import { ListarVagaPage } from './listar-vaga.page';
import { ComponentsModule } from 'src/app/components/components.module';
import {FiltroComponentComponent} from "./filtro-component/filtro-component.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ListarVagaPageRoutingModule
  ],
  declarations: [ListarVagaPage, FiltroComponentComponent]
})
export class ListarVagaPageModule {}
