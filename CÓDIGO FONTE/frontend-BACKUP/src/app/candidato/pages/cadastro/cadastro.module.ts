import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroPageRoutingModule } from './cadastro-routing.module';

import { CadastroPage } from './cadastro.page';
import {IonicSelectableComponent} from "ionic-selectable";
import {PopoverSelectComponent} from "./popover-select/popover-select.component";
import {MaskitoModule} from "@maskito/angular";
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroPageRoutingModule,
    IonicSelectableComponent,
    ComponentsModule,
    MaskitoModule
  ],
  declarations: [CadastroPage,PopoverSelectComponent]
})
export class CadastroPageModule {}
