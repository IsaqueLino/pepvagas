import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescricaoPageRoutingModule } from './descricao-routing.module';

import { DescricaoPage } from './descricao.page';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DescricaoPageRoutingModule,
        PdfViewerModule,
        NgOptimizedImage,
        ComponentsModule
    ],
  declarations: [DescricaoPage]
})
export class DescricaoPageModule {}
