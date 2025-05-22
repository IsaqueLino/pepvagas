import {Component, Input, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";
import {TipoUsuario} from "../../../../../shared/enums/TipoUsuario";

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.scss'],
})
export class CabecalhoComponent  implements OnInit {

  @Input() titulo: string = '';

  userType: string | null = '';

  constructor( private navCtrl: NavController,) { }

  ngOnInit() {

    this.userType = localStorage.getItem('userType');

  }

  navegarHome() {

    console.log(this.userType || '' || this.userType === TipoUsuario.LIBERAL)
    if(!this.userType) {
      this.navCtrl.navigateRoot('/home');
    } else {
      this.navCtrl.navigateRoot('/listar-vaga');
    }
  }
}
