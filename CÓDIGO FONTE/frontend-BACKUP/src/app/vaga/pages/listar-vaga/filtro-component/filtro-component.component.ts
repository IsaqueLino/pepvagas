import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-filtro-component',
  templateUrl: './filtro-component.component.html',
  styleUrls: ['./filtro-component.component.scss'],
})
export class FiltroComponentComponent  implements OnInit {

  @Input() public selected = {
    area: '',
    tipo: '',
    salario: {lower: 0, upper: 10000},
    regime: '',
    modalidade: '',
    pcd: false,
    cnh: '',
    curriculo: false,
    cep: '',
    cidade: '',
    uf: '',
  }

  @Input() public areas:any = []


  rangeOptions: any = {
    max : 10000,
    min : 0,
    step : 100,
  }

  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA',
    'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];



  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  pesquisarArea($event: MouseEvent) {

  }

  sair($event: MouseEvent) {

    this.popoverController.dismiss(this.selected);

  }


}
