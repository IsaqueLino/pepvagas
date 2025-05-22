import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Regime} from "../../../../shared/enums/Regime";
import {TipoVaga} from "../../../../shared/enums/TipoVaga";
import {Modalidade} from "../../../../shared/enums/Modalidade";
import {AnimationController, IonLabel, NavController} from "@ionic/angular";

@Component({
  selector: 'app-cadastro-geral',
  templateUrl: './cadastro-geral.page.html',
  styleUrls: ['./cadastro-geral.page.scss'],
})
export class CadastroGeralPage implements OnInit {


  escodito = true;

  tipoCadastro = {
    tipo: '' // Pode ser Candidato, empresa ou profissional
  }

  constructor(private animationCtrl: AnimationController,
              private navCtrl: NavController,
  ) {
  }

  ngOnInit() {


  }

  cadastrar() {

  }


  navigate(number: number) {


    // 1 - Navega pro cadastro de candidato
    // 2 - Navega pro cadastro de empresa
    // 3 - Navega pro cadastro de profissional
    if (number == 1) {
      this.navCtrl.navigateForward('cadastro-candidato', {
        queryParams: {
          "cadastrado": true
        }
      });
    } else if (number == 2) {

      this.navCtrl.navigateForward('cadastro-empresa', {
        queryParams: {
          "cadastrado": true
        }
      });

    } else if (number == 3) {
      this.navCtrl.navigateForward('cadastro-profissional', {
        queryParams: {
          "cadastrado": true
        }
      });
    }

  }
}
