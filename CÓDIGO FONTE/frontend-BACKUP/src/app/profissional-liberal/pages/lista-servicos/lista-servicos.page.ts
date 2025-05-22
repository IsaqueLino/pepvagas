import {Component, OnInit} from '@angular/core';
import {
  AlertController,
  InfiniteScrollCustomEvent,
  NavController,
  PopoverController,
  ToastController
} from "@ionic/angular";
import {api} from "../../../services/axios";
import {PesquisaUnicaComponent} from "../../../components/pesquisa-unica/pesquisa-unica.component";

@Component({
  selector: 'app-lista-servicos',
  templateUrl: './lista-servicos.page.html',
  styleUrls: ['./lista-servicos.page.scss'],
})
export class ListaServicosPage implements OnInit {

  profissionais: any[] = [];
  itens: any[] = [];
  results: any[] = [...this.profissionais];
  search: string = "";
  size: number = 12;

  profissionaisData: any[] = [];

  opcaoFiltro: any = {
    nome: false,
    servico: true
  };

  public ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
  selectedUf: string = '';
  tiposServicos: any[] = [];
  selectedServico: string = '';
  selectedNome: string = '';
  selectedCidade: string = '';
  selectedCep: string = '';

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    public popoverController: PopoverController
  ) {
  }

  ngOnInit() {
    this.ionViewDidEnter();
  }

  async carregarLista() {
    api.get('/list-profissionais')
      .then(response => {
        // Armazenar a lista de administradores na propriedade
        this.profissionais = response.data;
        for (let profissional of this.profissionais) {
          if (this.profissionaisData.filter(profissionalData => profissionalData.idProfissionalLiberal == profissional.idProfissionalLiberal).length > 0) continue;
          let listaServicos = profissional.tipoServicos.map((servico: any) => {
            return ' ' + servico.nome;
          });
          this.profissionaisData.push({
            idProfissionalLiberal: profissional.idProfissionalLiberal,
            nome: profissional.nome,
            servicos: listaServicos,
            descricao: profissional.descricao,
            cidade: profissional.cidade,
            uf: profissional.uf,
            logradouro: profissional.logradouro,

          });
        }
        this.results = [...this.profissionaisData];
      })
      .catch(error => {
        // Lidar com erros aqui
        console.error('Erro:', error);
        this.showToast('Erro ao carregar lista de profissionais', 'danger');
      });
  }

  async carregarServicos() {

    api.get('/list-tipo-servicos').then((response) => {
        let data = response.data;

        for (let i = 0; i < data.length; i++) {
          this.tiposServicos.push(data[i].nome);
        }


      }
    ).catch((error) => {
      console.error(error);
    });
  }


  navegarParaVisualizar(id: number) {
    this.navCtrl.navigateForward('/descricao', {
      queryParams: {
        "id": id
      }
    });
  }


  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000, // Duração do toast em milissegundos (2 segundos neste exemplo)
      position: 'top', // Posição do toast na tela (pode ser 'top', 'middle' ou 'bottom')
      color: color, // Cor do toast (pode ser 'success', 'danger', etc.)
    });

    toast.present();
  }

  ionViewDidEnter() {
    this.carregarLista().then(() => {
    });
    this.carregarServicos().then(() => {
      console.log(this.tiposServicos)
    });

  }

  handleInput(event: any, opcao: string) {

    // Vai filtrar a lista de profissionais a partir do que o usuário digitar
    // O filtro deve ser feito por nome, endereço e serviço

    if (opcao == 'nome') {

      this.selectedNome = event.target.value;

    } else if (opcao == 'endereco') {

      this.selectedCidade = event.target.value;
    }

    requestAnimationFrame(() => {
      this.results = this.profissionaisData.filter(item => {
        return (item.nome.toLowerCase().indexOf(this.selectedNome.toLowerCase()) > -1) && (item.cidade.toLowerCase().indexOf(this.selectedCidade.toLowerCase()) > -1 && (item.uf.toLowerCase().indexOf(this.selectedUf.toLowerCase()) > -1) && (item.servicos.toString().toLowerCase().indexOf(this.selectedServico.toLowerCase()) > -1));
      });
    });

  }

  async pesquisarServico(e: any) {
    const popover = await this.popoverController.create({
      component: PesquisaUnicaComponent,
      componentProps: {lista: this.tiposServicos, titulo: 'Pesquisar por serviço', placeholder: 'Digite o serviço'},
      event: e
    });

    await popover.present();

    const {data} = await popover.onWillDismiss();
    if (data) {
      this.selectedServico = data;
    }
  }

  async pesquisarUf(e: any) {
    const popover = await this.popoverController.create({
      component: PesquisaUnicaComponent,
      componentProps: {lista: this.ufs, titulo: 'Pesquisar por estado', placeholder: 'Digite o estado'},
      event: e
    });

    await popover.present();

    const {data} = await popover.onWillDismiss();
    if (data) {
      this.selectedUf = data;
    }
  }

  limpar() {
    // Vai limpar os filtros
    this.selectedNome = '';
    this.selectedCidade = '';
    this.selectedServico = '';
    this.selectedUf = '';
    this.results = this.profissionaisData;

  }
}
