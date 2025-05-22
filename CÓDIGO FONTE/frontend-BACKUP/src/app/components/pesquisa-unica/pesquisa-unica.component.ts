import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'pesquisa-unica',
  templateUrl: './pesquisa-unica.component.html',
  styleUrls: ['./pesquisa-unica.component.scss'],
})
export class PesquisaUnicaComponent  implements OnInit {

  @Input() titulo: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() lista: any[] = [];

  itens: any[] = [];
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
    // Lipa a lista de duplicados
    this.lista = this.lista.filter((item, index) => {
      return this.lista.indexOf(item) === index;
    });
    this.itens = this.lista;
    console.log(this.lista)


  }

  getItems($event: any) {
    let val = $event.target.value;
    console.log(val);
    val = val.trim();
    if (val == '') {
      this.itens = this.lista;
      return;
    }else {
      this.itens = this.lista.filter(item => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }

  }

  selecionarItem(item: any) {
    this.value = item;

    console.log(item);
    this.itens = [];

    this.popoverController.dismiss(item);
  }
}
