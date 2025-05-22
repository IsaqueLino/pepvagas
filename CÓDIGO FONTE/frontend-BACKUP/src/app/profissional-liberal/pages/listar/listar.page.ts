import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import {AxiosError} from "axios";

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  profissionais: any[] = [];
  originalProfissionais: any[] = [];
  termoPesquisa: string = '';
  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
    this.ionViewDidEnter();
  }

  carregarLista() {
    api.get('/list-all-profissionais')
      .then(response => {
        this.profissionais = response.data;
        this.originalProfissionais = [...this.profissionais];
      })
      .catch(error => {
        console.error('Erro:', error);
        this.showToast(`Erro ao listar profissionais: ${error}`, 'danger');
      });
  }

  navegarParaAlterar(id: number) {
    this.navCtrl.navigateForward('/alterar-profissional', {
      queryParams: {
        "id": id
      }
    });
  }

  navegarParaVisualizar(id: number) {
    this.navCtrl.navigateForward('/visualizar-profissional', {
      queryParams: {
        "id": id
      }
    });
  }

  adicionarNovoProfissional() {
    this.navCtrl.navigateForward('/cadastro-profissional');
  }

  async deletarProfissional(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir este profissional?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Exclusão cancelada');
          },
        },
        {
          text: 'Excluir',
          handler: () => {
            // Faça a solicitação de exclusão do administrador com o ID especificado
            api.delete(`/delete-profissional/${id}`)
              .then(response => {
                // Atualize a lista de administradores após a exclusão
                this.profissionais = this.profissionais.filter(profissional => profissional.id !== id);
                this.showToast('Profissional excluído.', 'success');
                this.carregarLista();
              })
              .catch(error => {
                // Lidar com erros aqui
                console.error('Erro ao excluir profissional:', error);
                this.showToast(`Erro ao excluir profissional: ${error}`, 'danger');
              });
          },
        },
      ],
    });

    await alert.present();
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
    this.carregarLista();
  }

  async reativarPerfil(idProfissionalLiberal: any) {
    const alert = await this.alertController.create({
      header: 'Reativar Perfil',
      message: 'Tem certeza de que deseja reativar o perfil deste profissional?',
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
              const response = await api.put(`/reactivate-profissional/${idProfissionalLiberal}`)
              if (response.status === 200) {
                console.log('Profissional reativado com sucesso');
                this.showToast('Profissional reativado com sucesso', 'success');
                this.carregarLista();
              } else {
                console.error('Erro ao reativar o profissional:', response.data.message);
                this.showToast('Erro ao reativar o profissional', 'danger');
              }
            } catch (error: any) {
              if (error.response.status === 409) {
                if (error.response.data.message.includes('email')) {
                  this.showToast('Não é possível reativar este perfil, já existe um profissional com o mesmo e-mail cadastrado.', 'danger');
                }
              } else {
                console.error('Erro ao reativar o profissional liberal:', error);
                this.showToast('Erro ao reativar o profissional liberal', 'danger');
              }
            }
          },
        },
      ],
    });
    await alert.present();
  }


  filtrarProfissionalPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.profissionais = [...this.originalProfissionais]; // Restaura as vagas originais
      return;
    }
    this.profissionais = this.originalProfissionais.filter(profissional =>
      profissional.nome.toLowerCase().includes(termoPesquisa)
    );
  }
}
