import {NgModule} from "@angular/core";
import {CabecalhoComponent} from "./cabecalho/cabecalho.component";
import {IonicModule} from "@ionic/angular";
import {PesquisaUnicaComponent} from "./pesquisa-unica/pesquisa-unica.component";
import {NgForOf, NgIf} from "@angular/common";


@NgModule(
  {
    declarations: [CabecalhoComponent, PesquisaUnicaComponent],
    exports: [CabecalhoComponent, PesquisaUnicaComponent],
    imports: [
      IonicModule,
      NgForOf,
      NgIf
    ]
  }
)
export class ComponentsModule {}
