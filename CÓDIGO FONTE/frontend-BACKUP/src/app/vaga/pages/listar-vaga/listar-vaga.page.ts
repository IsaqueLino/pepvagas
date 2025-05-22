import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController, PopoverController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { PesquisaUnicaComponent } from "../../../components/pesquisa-unica/pesquisa-unica.component";
import { FiltroComponentComponent } from "./filtro-component/filtro-component.component";

@Component({
  selector: 'app-listar-vaga',
  templateUrl: './listar-vaga.page.html',
  styleUrls: ['./listar-vaga.page.scss'],
})
export class ListarVagaPage implements OnInit {

  vagas: any[] = [];
  imagems: any[] = [];
  userType: any;
  userId: any;
  termoPesquisa: string = '';
  originalVagas: any[] = [];
  originalVagasToCandidate: any[] = [];
  vagasToCandidate: any[] = [];

  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA',
    'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  areas: any[] = [];

  rangeOptions: any = {
    max: 10000,
    min: 0,
    step: 100,
  }

  selected = {
    area: '',
    tipo: '',
    salario: 0,
    salarioTipo: '',
    salarioRange: { lower: 0, upper: 10000 },
    regime: '',
    modalidade: '',
    pcd: false,
    cnh: '',
    curriculo: false,
    cep: '',
    cidade: '',
    uf: '',
  }

  selectedArea: string = '';
  selectedTipo: string = '';
  selectedSalario: { lower: number, upper: number } = { lower: 0, upper: 10000 };
  selectedRegime: string = '';
  selectedModalidade: string = '';
  selectedPcd: boolean = false;
  selectedCnh: string = '';
  selectedCurriculo: boolean = false;

  selectedCep: string = '';
  selectedCidade: string = '';
  selectedUf: string = '';

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    public popoverController: PopoverController) {
  }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.userId = localStorage.getItem('userId');
    this.ionViewDidEnter();
  }

  //Administrador
  async carregarTodasVagasAdministrador() {
    if (this.userType == 'Administrador' || this.userType == null) {
      const response = await api.get('/list-vagas-administrador');
      this.vagas = response.data;

      this.originalVagas = [...this.vagas];

      let file = null;

      for (let i = 0; i < this.vagas.length; i++) {
        file = await api.get(`/find-file-vaga/${this.vagas[i].idVaga}`).then((response) => {
          this.vagas[i].imagem = 'data:image/jpeg;base64,' + response.data;

        }).catch((error) => {
          console.error(error);
        });
      }

    }
  }


  //Candidato
  async carregarTodasVagasCandidato() {
    if (this.userType == 'Candidato' || this.userType == null) {
      const response = await api.get('/list-vagas-candidato')
      this.vagas = response.data;

      this.originalVagas = [...this.vagas];

      let file = null;

      for (let i = 0; i < this.vagas.length; i++) {
        file = await api.get(`/find-file-vaga/${this.vagas[i].idVaga}`).then((response) => {
          this.vagas[i].imagem = 'data:image/jpeg;base64,' + response.data;

        }).catch((error) => {
          console.error(error);
        });
      }

      await api.get(`/list-vagas-candidato/${this.userId}`)
        .then(response => {
          this.vagasToCandidate = response.data;
          this.originalVagasToCandidate = [...this.vagasToCandidate];
        })
        .catch(error => {
          console.error('Erro:', error);
        });

      // Limpa o array de vagas, removendo as vagas que estão no array de vagas para o candidato
      this.vagas = this.vagas.filter(vaga => !this.vagasToCandidate.some(vagaToCandidate => vagaToCandidate.idVaga === vaga.idVaga));
      this.originalVagas = [...this.vagas];

    }
  }

  //Empresa e Representante
  async carregarTodasVagasDaEmpresa() {
    let representante: any = '';
    if (this.userType == 'Empresa' || this.userType == 'Representante') {
      console.log('ID do Usuário:', this.userId);
      const response = await api.get(`/find-representante/${this.userId}`); // Substitua '/find' pela rota real em seu servidor
      representante = response.data;
      await api.get(`/list-vagas-empresa/${representante.idEmpresa}`)
      this.vagas = response.data;
      this.originalVagas = [...this.vagas];

      let file = null;

      for (let i = 0; i < this.vagas.length; i++) {
        file = await api.get(`/find-file-vaga/${this.vagas[i].idVaga}`).then((response) => {
          this.vagas[i].imagem = 'data:image/jpeg;base64,' + response.data;

        }).catch((error) => {
          console.error(error);
        });
      }
    }
  }
  //Membros da Equipe
  async carregarTodasVagasDaEquipe() {
    if (this.userType == 'Equipe') {
      const response = await api.get('/list-vagas-equipe')
          this.vagas = response.data;
          this.originalVagas = [...this.vagas];
      
          let file = null;

          for (let i = 0; i < this.vagas.length; i++) {
            file = await api.get(`/find-file-vaga/${this.vagas[i].idVaga}`).then((response) => {
              this.vagas[i].imagem = 'data:image/jpeg;base64,' + response.data;
    
            } ).catch((error) => {
              console.error(error);
            });
          }
        }
  }

  async carregarAreas() {
    await api.get('/list-areas').then((response) => {
      // Retorna so o nome das areas
      let data = response.data;
      for (let i = 0; i < data.length; i++) {
        this.areas.push(data[i].nome);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  navegarParaAlterar(idVaga: number) {
    this.navCtrl.navigateForward('/alterar-vaga', {
      queryParams: {
        "idVaga": idVaga
      }
    });
  }

  navegarParaVisualizar(idVaga: number) {
    this.navCtrl.navigateForward('/visualizar-vaga', {
      queryParams: {
        "idVaga": idVaga
      }
    });
  }

  navegarParaListarCandidatos(idVaga: number) {
    this.navCtrl.navigateForward('/lista-candidatos', {
      queryParams: {
        "idVaga": idVaga
      }
    });
  }

  alterarVaga(idVaga: number) {
    this.navCtrl.navigateForward('/alterar-vaga', {
      queryParams: {
        "idVaga": idVaga
      }
    });
  }

  adicionarNovaVaga() {
    this.navCtrl.navigateForward('/cadastro-vaga');
  }

  formatarData(data: string): string {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  async darBaixaVaga(idVaga: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja dar baixa nessa vaga?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Baixa cancelada');
          },
        },
        {
          text: 'Dar Baixa',
          handler: async () => {
            try {
              if (this.userType == 'Administrador') {
                await api.delete(`/delete-vaga-adm/${idVaga}?idAdministradorExcluiu=${this.userId}`);
              }

              if (this.userType == 'Equipe') {
                await api.delete(`/delete-vaga-equipe/${idVaga}?idEquipeExcluiu=${this.userId}`);
              }

              if (this.userType == 'Representante') {
                await api.delete(`/delete-vaga-representante/${idVaga}?idRepresentanteExcluiu=${this.userId}`);
              }

              this.vagas = this.vagas.filter(vaga => vaga.idVaga !== idVaga);
              this.showToast('Baixa efetuada.', 'success');
              this.ionViewDidEnter();
            } catch (error) {
              console.error('Erro ao dar baixa na vaga:', error);
              this.showToast(`Erro ao dar baixa na vaga: ${error}`, 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  }


  filtrarVagasPorTitulo() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.vagas = [...this.originalVagas];
      if (this.userType == 'Candidato') {
        this.vagasToCandidate = [...this.originalVagasToCandidate];
      }
      return;
    }
    this.vagas = this.originalVagas.filter(vaga =>
      vaga.titulo_vaga.toLowerCase().includes(termoPesquisa)
    );
    if (this.userType == 'Candidato') {
      this.vagasToCandidate = this.originalVagasToCandidate.filter(vaga =>
        vaga.titulo_vaga.toLowerCase().includes(termoPesquisa)
      );
    }
  }

  showFilter(e: any) {

    const popover = this.popoverController.create({
      component: FiltroComponentComponent,
      componentProps: { selected: this.selected, areas: this.areas, rangeOptions: this.rangeOptions },
      cssClass: 'pop',
      side: 'left',
      alignment: 'start',
      size: 'auto',
      reference: 'trigger',
      // backdropDismiss: false,
      event: e,
    });

    popover.then((popoverElement) => {
      popoverElement.present();

      popoverElement.onDidDismiss().then((dataReturned) => {
        console.log('Filtro fechado');
        console.log(dataReturned);
        this.filtro({ target: { value: dataReturned.data } }, 'filtro')
      });
    })
  }

  async filtro(event: any, opcao: string) {
    // Filtra as vagas a partir de todos os campos delas
    // Ele ira se feito baseado na lista original de vagas, para que não haja perda de dados
    // Lista de vagas para o candidato
    console.log(this.selected)
    if (this.userType == 'Candidato') {
      console.log('Filtro para o candidato');
      this.vagasToCandidate = [...this.originalVagasToCandidate].filter(vaga => {
        return (
          vaga.titulo_vaga.toLowerCase().includes(this.termoPesquisa.toLowerCase().trim()) &&
          vaga.idArea2.nome.toLowerCase().includes(this.selected.area.toLowerCase().trim()) &&
          // vaga.salario >= this.selectedSalario.lower && vaga.salario <= this.selectedSalario.upper &&
          vaga.tipo_vaga.toLowerCase().includes(this.selected.tipo.toLowerCase().trim()) &&
          vaga.regime.toLowerCase().includes(this.selected.regime.toLowerCase().trim()) &&
          vaga.modalidade.toLowerCase().includes(this.selected.modalidade.toLowerCase().trim()) &&
          vaga.cnh.toLowerCase().includes(this.selected.cnh.toLowerCase().trim()) &&
          vaga.pcd == this.selected.pcd &&
          (vaga.email_curriculo != null && vaga.email_curriculo != "") == this.selected.curriculo


        );

      });
    }
    console.log(this.userType)
    this.vagas = [...this.originalVagas].filter(vaga => {
      console.log(vaga)

      return (
        vaga.titulo_vaga.toLowerCase().includes(this.termoPesquisa.toLowerCase().trim()) &&
        vaga.idArea2.nome.toLowerCase().includes(this.selected.area.toLowerCase().trim()) &&
        // vaga.salario >= this.selectedSalario.lower && vaga.salario <= this.selectedSalario.upper &&
        vaga.tipo_vaga.toLowerCase().includes(this.selected.tipo.toLowerCase().trim()) &&
        vaga.regime.toLowerCase().includes(this.selected.regime.toLowerCase().trim()) &&
        vaga.modalidade.toLowerCase().includes(this.selected.modalidade.toLowerCase().trim()) &&
        vaga.cnh.toLowerCase().includes(this.selected.cnh.toLowerCase().trim()) &&
        vaga.pcd == this.selected.pcd &&
        (vaga.email_curriculo != null && vaga.email_curriculo != "") == this.selected.curriculo
      );
    });

  }

  limpar() {
    this.termoPesquisa = '';
    this.selected.area = '';
    this.selected.tipo = '';
    this.selected.salarioRange = { lower: 0, upper: 10000 };
    this.selected.regime = '';
    this.selected.modalidade = '';
    this.selected.pcd = false;
    this.selected.cnh = '';
    this.selected.curriculo = false;
    this.selected.cep = '';
    this.selected.cidade = '';
    this.selected.uf = '';
    this.filtro({ target: { value: '' } }, 'filtro');
  }

  async pesquisarArea(e: any) {
    const popover = await this.popoverController.create({
      component: PesquisaUnicaComponent,
      componentProps: { lista: this.areas, titulo: 'Pesquisar por área', placeholder: 'Digite a área' },
      event: e
    });

    await popover.present();

    popover.onWillDismiss().then(({ data }) => {
      if (data) {
        this.selected.area = data;
        this.filtro({ target: { value: data } }, 'area');
      }
    });

  }


  pesquisarSalario($event: any) {
    this.filtro($event, 'salario');
  }

  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
      color: color,
    });

    toast.present();
  }


  ionViewDidEnter() {
    console.log(`${this.userType} - ${this.userId}`);
    if (this.userType == 'Administrador') {
      console.log("Todas Vagas do Administrador");
      this.carregarTodasVagasAdministrador();
    } else if (this.userType == 'Candidato') {
      console.log("Todas Vagas do Candidato");
      this.carregarTodasVagasCandidato();
    } else if (this.userType == 'Empresa' || this.userType == 'Representante') {
      console.log("Todas Vagas da Empresa");
      this.carregarTodasVagasDaEmpresa();
    } else if (this.userType == 'Equipe') {
      console.log("Todas Vagas publicadas pela Equipe");
      this.carregarTodasVagasDaEquipe();
    } else {
      console.log("Todas Vagas do Candidato");
      this.carregarTodasVagasCandidato();
    }
    this.carregarAreas();
  }

  async reativarVaga(idVaga: number) {
    const alert = await this.alertController.create({
      header: 'Reativar Vaga',
      message: 'Tem certeza de que deseja reativar a vaga?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Reativação cancelada');
          },
        },
        {
          text: 'Reativar',
          handler: async () => {
            try {
              const response = await api.put(`/reactivate-vaga/${idVaga}`);
              if (response.status === 200) {
                console.log('Vaga reativada com sucesso');
                this.showToast('Vaga reativada com sucesso', 'success');
                this.ionViewDidEnter();
              } else {
                console.error('Erro ao reativar a vaga:', response.data.message);
                this.showToast('Erro ao reativar a vaga', 'danger');
              }
            } catch (error) {
              console.error('Erro ao reativar a vaga:', error);
              this.showToast(`Erro ao reativar a vaga: ${error}`, 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  }
}

