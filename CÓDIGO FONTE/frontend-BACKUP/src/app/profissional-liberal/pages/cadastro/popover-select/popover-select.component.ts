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

  @Input() tipos: string[] = [];
  @Input() tiposSelecionadas: string[] = [];
  itens: any[] = [];
  itensFiltrados: any[] = [];
  public results: string[] = [];


  constructor(private popoverController: PopoverController) {}

  ngOnInit() {

    api.get('/list-tipo-servicos').then((response) => {
        let data = response.data;
        for (let i = 0; i < data.length; i++) {
          this.tipos.push(data[i].nome);
        }
        this.itens = this.tipos.map((tipo: any) => {

            return {
              nome: tipo,
              cheked: this.tiposSelecionadas.map((tipoSelecionada: any) => {
                  return tipoSelecionada.nome === tipo;
                }
              ).includes(true)
            }
          }
        );

        this.itensFiltrados = this.itens;
      }
    ).catch((error) => {
      console.error(error);
    });

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
    this.itensFiltrados = this.itens.filter((d: string) => d.toLowerCase().indexOf(query) > -1);
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
