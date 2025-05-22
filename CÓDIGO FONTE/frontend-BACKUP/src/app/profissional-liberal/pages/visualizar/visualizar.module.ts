import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizarPageRoutingModule } from './visualizar-routing.module';

import { VisualizarPage } from './visualizar.page';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {ComponentsModule} from "../../../components/components.module";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        VisualizarPageRoutingModule,
        PdfViewerModule,
        ComponentsModule,
        NgSelectModule
    ],
  declarations: [VisualizarPage]
})
export class VisualizarPageModule {}
