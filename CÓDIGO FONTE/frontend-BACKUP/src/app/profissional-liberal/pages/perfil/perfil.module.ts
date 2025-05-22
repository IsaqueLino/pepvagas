import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';

import { PerfilPage } from './perfil.page';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PerfilPageRoutingModule,
        PdfViewerModule,
        ComponentsModule
    ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
