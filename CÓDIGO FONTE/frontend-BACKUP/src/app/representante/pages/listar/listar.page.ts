import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  representantes: any[] = [];
  originalRepresentantes: any[] = [];
  termoPesquisa: string = '';

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.ionViewDidEnter();
  }

  carregarLista() {
    api.get('/list-representantes')
      .then(response => {
        this.representantes = response.data;
        this.originalRepresentantes = [...this.representantes];
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  navegarParaAlterar(idRepresentante: number) {
    this.navCtrl.navigateForward('/alterar-representante', {
      queryParams: {
        "idRepresentante": idRepresentante
      }
    });
  }

  navegarParaVisualizar(idRepresentante: number) {
    this.navCtrl.navigateForward('/visualizar-representante', {
      queryParams: {
        "idRepresentante": idRepresentante
      }
    });
  }

  adicionarNovoRepresentante() {
    this.navCtrl.navigateForward('/cadastro-representante');
  }

  async deletarRepresentante(idRepresentante: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja desativar este Representante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Ação cancelada');
          },
        },
        {
          text: 'Desativar',
          handler: () => {
            api.delete(`/delete-representante/${idRepresentante}`)
              .then(response => {
                this.representantes = this.representantes.filter(representante => representante.idRepresentante !== idRepresentante);
                this.showToast('Representante desativado.', 'success');
                this.carregarLista();
              })
              .catch(error => {
                if (error.response.status === 400) {
                  this.showToast('Não é possível desativar o representante, pois há vagas vinculadas à ele', 'danger');
                } else {
                  console.error('Erro ao desativar representante:', error);
                  this.showToast(`Erro ao desativar representante: ${error}`, 'danger');
                }
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

  async reativarPerfil(idRepresentante: number) {
    const alert = await this.alertController.create({
      header: 'Reativar Perfil',
      message: 'Tem certeza de que deseja reativar o perfil deste representante?',
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
              const response = await api.put(`/reactivate-representante/${idRepresentante}`);
              if (response.status === 200) {
                console.log('Representante reativado com sucesso');
                this.showToast('Representante reativado com sucesso', 'success');
                this.carregarLista();
              } else {
                console.error('Erro ao reativar o representante:', response.data.message);
                this.showToast('Erro ao reativar o representante', 'danger');
              }
            } catch (error: any) {
              if (error.response.status === 409) {
                if (error.response.data.message.includes('email')) {
                  this.showToast('Não é possível reativar este perfil, já existe um representante com o mesmo e-mail cadastrado.', 'danger');
                }
              } else {
                console.error('Erro ao reativar o representante:', error);
                this.showToast('Erro ao reativar o representante', 'danger');
              }
            }
          },
        },
      ],
    });
    await alert.present();
  }


  filtrarRepresentantesPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.representantes = [...this.originalRepresentantes]; // Restaura as vagas originais
      return;
    }
    this.representantes = this.originalRepresentantes.filter(representante =>
      representante.nome.toLowerCase().includes(termoPesquisa)
    );
  }

}