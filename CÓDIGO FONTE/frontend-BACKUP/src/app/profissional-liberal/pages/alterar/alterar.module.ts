import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlterarPageRoutingModule } from './alterar-routing.module';

import { AlterarPage } from './alterar.page';
import {NgSelectModule} from "@ng-select/ng-select";
import {ComponentsModule} from "../../../components/components.module";
import {MaskitoModule} from "@maskito/angular";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AlterarPageRoutingModule,
        NgSelectModule,
        ComponentsModule,
        MaskitoModule
    ],
  declarations: [AlterarPage]
})
export class AlterarPageModule {}
