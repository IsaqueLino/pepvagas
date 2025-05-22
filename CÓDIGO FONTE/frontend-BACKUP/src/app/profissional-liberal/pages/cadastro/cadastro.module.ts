import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroPageRoutingModule } from './cadastro-routing.module';

import { CadastroPage } from './cadastro.page';
import {PopoverSelectComponent} from "./popover-select/popover-select.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {MaskitoModule} from "@maskito/angular";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CadastroPageRoutingModule,
        NgSelectModule,
        MaskitoModule,
        ComponentsModule
    ],
  declarations: [CadastroPage, PopoverSelectComponent]
})
export class CadastroPageModule {}
