import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlterarPageRoutingModule } from './alterar-routing.module';

import { AlterarPage } from './alterar.page';
import {PopoverSelectComponent} from "./popover-select/popover-select.component";
import {MaskitoModule} from "@maskito/angular";
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AlterarPageRoutingModule,
        ComponentsModule,
        MaskitoModule
    ],
  declarations: [AlterarPage, PopoverSelectComponent]
})
export class AlterarPageModule {}
