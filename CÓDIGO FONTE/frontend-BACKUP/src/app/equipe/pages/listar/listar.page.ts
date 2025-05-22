import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { AxiosError } from 'axios';
@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  equipe: any[] = [];
  originalEquipe: any[] = [];
  termoPesquisa: string = '';

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.ionViewDidEnter();
  }

  async carregarLista() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.showToast('Você precisa estar logado para visualizar os membros da equipe!', 'danger');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await api.get('/list-equipes', { headers });

      if (response.status === 200) {
        this.equipe = response.data;
        this.originalEquipe = [...this.equipe];
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
        if (error.response?.status === 500) {
          this.showToast('Erro ao carregar membros da equipe, por favor faça login novamente.', 'danger');
          return;
        }
      }
    }
  }

  async navegarParaAlterar(idEquipe: number) {
    this.navCtrl.navigateForward('/alterar-equipe', {
      queryParams: {
        "idEquipe": idEquipe
      }
    });
  }

  async navegarParaVisualizar(idEquipe: number) {
    this.navCtrl.navigateForward('/visualizar-equipe', {
      queryParams: {
        "idEquipe": idEquipe
      }
    });
  }

  async adicionarNovoMembroDaEquipe() {
    this.navCtrl.navigateForward('/cadastro-equipe');
  }

  async deletarMembroDaEquipe(idEquipe: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja desativar este membro da equipe?',
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
          handler: async () => {
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                this.showToast('Você precisa estar logado para desativar o membro da equipe!', 'danger');
                return;
              }

              const headers = {
                'Authorization': `Bearer ${token}`
              };

              const response = await api.delete(`/delete-equipe/${idEquipe}`, { headers });

              if (response.status === 200) {
                this.showToast('Membro da equipe desativado com sucesso!', 'success');
                this.carregarLista();
              }
            } catch (error) {
              if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                  this.showToast(error.response?.data.message, 'danger');
                  return;
                }
                if (error.response?.status === 500) {
                  this.showToast('Erro ao desativar membro da equipe, por favor faça login novamente.', 'danger');
                  return;
                }
              }
            }
          }
        }],
    });

    await alert.present();
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
    this.carregarLista();
  }

  filtrarMembroPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.equipe = [...this.originalEquipe]; // Restaura as vagas originais
      return;
    }
    this.equipe = this.originalEquipe.filter(membro =>
      membro.nome.toLowerCase().includes(termoPesquisa)
    );
  }

  async reativarPerfil(idEquipe: number) {
    const alert = await this.alertController.create({
      header: 'Reativar Perfil',
      message: 'Tem certeza de que deseja reativar o perfil deste membro da equipe?',
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
              const response = await api.put(`/reactivate-equipe/${idEquipe}`);
              if (response.status === 200) {
                console.log('Membro da Equipe reativado com sucesso');
                this.showToast('Membro da Equipe reativado com sucesso', 'success');
                this.carregarLista();
              } else {
                console.error('Erro ao reativar o membro da equipe:', response.data.message);
                this.showToast('Erro ao reativar o membro da equipe', 'danger');
              }
            } catch (error: any) {
              if (error.response.status === 409) {
                if (error.response.data.message.includes('email')) {
                  this.showToast('Não é possível reativar este perfil, já existe um membro com o mesmo e-mail cadastrado.', 'danger');
                }
              } else {
                console.error('Erro ao reativar o membro de equipe:', error);
                this.showToast('Erro ao reativar o membro de equipe', 'danger');
              }
            }
          },
        },
      ],
    });
    await alert.present();
  }

}