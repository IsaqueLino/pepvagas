import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-popover-select',
  templateUrl: './popover-select.component.html',
  styleUrls: ['./popover-select.component.scss'],
})
export class PopoverSelectComponent implements OnInit {

  @Input() areas: string[] = [];
  @Input() areasSelecionadas: string[] = [];
  itens: any[] = [];
  itensFiltrados: any[] = [];
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

    this.itensFiltrados = this.itens;
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

  filterItems(query: any) {

  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.itensFiltrados = this.itens.filter((item: any) => {
        if (item.nome.toLowerCase().indexOf(query) > -1) {
          return item;
        }
      }
    );
  }

  returnResults(){
    return this.itens.filter((item: any) => {
        if (item.cheked) {
          return item;
        }
      }
    );
  }

  closePopover() {
    this.results = this.returnResults();
    this.popoverController.dismiss(this.results);
  }
}
