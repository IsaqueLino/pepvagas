import {Component, Input, OnInit} from '@angular/core';
import {api} from "../../../../services/axios";
import {PopoverController} from "@ionic/angular";
import {filter} from "rxjs";

@Component({
  selector: 'app-popover-select',
  templateUrl: './popover-select.component.html',
  styleUrls: ['./popover-select.component.scss'],
})
export class PopoverSelectComponent implements OnInit {

  @Input() areas: string[] = [];
  @Input() areasSelecionadas: string[] = [];
  itens: any[] = [];
  public results: string[] = [];


  constructor(private popoverController: PopoverController) {


  }

  ngOnInit() {
    // Gera a lista de itens a partir da lista de áreas, e se ja estiver selecionado, marca como selecionado
    this.itens = this.areas.map((area: any) => {

        return {
          nome: area,
          cheked: this.areasSelecionadas.map((areaSelecionada: any) => {
              return areaSelecionada.nome === area;
            }
          ).includes(true)
        }
      }
    );
  }

  onDismiss() {
    this.popoverController.dismiss(this.results);
  }

  selectItem(event: any, item: any) {

    if (event.detail.checked) {
      // Fazer o item se tornar selecionado na lista de itens
      this.itens.map((itemLista: any) => {
          if (itemLista.nome === item.nome) {
            itemLista.cheked = true;
          }
        }
      );
    } else {
      this.itens.map((itemLista: any) => {
          if (itemLista.nome === item.nome) {
            itemLista.cheked = false;
          }
      });

    }
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.itens = this.areas.filter((d: string) => d.toLowerCase().indexOf(query) > -1);
  }

  closePopover() {
    this.results = this.itens.filter((item: any) => {
        if (item.cheked) {
          return item;
        }
      }
    );

    this.popoverController.dismiss(this.results);
  }
}
