import {NgModule} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import { VagaComponent } from "./vaga/vaga.component";
import { NavComponent } from "./nav/nav.component";
import { RouterModule } from "@angular/router";


@NgModule(
  {
    declarations: [VagaComponent, NavComponent],
    exports: [VagaComponent, NavComponent],
    imports: [
      IonicModule,
      NgForOf,
      NgIf,
      RouterModule
    ]
  }
)
export class ComponentsModule {}
