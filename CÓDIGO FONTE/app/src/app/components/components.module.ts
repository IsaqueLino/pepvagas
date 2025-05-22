import {NgModule} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import { NavComponent } from "./nav/nav.component";
import { VagaComponent } from "./vaga/vaga.component";
import { ShowHidePasswordComponent } from "./show-hide-password/show-hide-password.component";


@NgModule(
  {
    declarations: [NavComponent, VagaComponent, ShowHidePasswordComponent],
    exports: [NavComponent, VagaComponent, ShowHidePasswordComponent],
    imports: [
      IonicModule,
      NgForOf,
      NgIf
    ]
  }
)
export class ComponentsModule {}
