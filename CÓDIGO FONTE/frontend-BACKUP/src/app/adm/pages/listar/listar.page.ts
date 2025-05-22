import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { AdminData } from '../../adminData';
import { AxiosError } from 'axios';
@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  administradores: any[] = [];
  nome: string = '';
  dataCriacao: Date | null = null;
  dataAlteracao: Date | null = null;
  originalAdministradores: any[] = [];
  termoPesquisa: string = '';

  id: any;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
    this.id = localStorage.getItem('userId');
    this.ionViewDidEnter();
  }

  async carregarLista() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.showToast('Você precisa estar logado para visualizar os administradores!', 'danger');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await api.get('/list-admins', { headers });

      if (response.status === 200) {
        this.administradores = response.data;
        this.originalAdministradores = [...this.administradores];
        this.administradores.forEach(async (admin: AdminData) => {
          if (admin.updateBy) {
            const response = await api.get(`/find-admin/${admin.updateBy}`, { headers });
            if (response.status === 200) {
              admin.updateBy = response.data.nome;
              this.nome = response.data.nome;
              //O Nome apresentava sempre o último nome encontrado para todos.
              this.dataCriacao = admin.createdAt ? new Date(admin.createdAt) : null;
              this.dataAlteracao = admin.updatedAt ? new Date(admin.updatedAt) : null;
            }
          }
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
        if (error.response?.status === 500) {
          this.showToast('Erro ao carregar administradores, por favor faça login novamente.', 'danger');
          return;
        }
      }

    }
  }

  async navegarParaAlterar(idAdministrador: number) {
    this.navCtrl.navigateForward('/alterar-adm', {
      queryParams: {
        "idAdministrador": idAdministrador
      }
    });
  }

  async navegarParaVisualizar(idAdministrador: number) {
    this.navCtrl.navigateForward('/visualizar-adm', {
      queryParams: {
        "idAdministrador": idAdministrador
      }
    });
  }

  async adicionarNovoAdmin() {

    this.navCtrl.navigateForward('/cadastro-adm');
  }

  async deletarADM(idAdministrador: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja desativar este administrador?',
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
                this.showToast('Você precisa estar logado para desativar o administrador!', 'danger');
                return;
              }

              const headers = {
                'Authorization': `Bearer ${token}`
              };

              const response = await api.delete(`/delete-admin/${idAdministrador}`, { headers });

              if (response.status === 200) {
                this.showToast('Administrador desativado com sucesso!', 'success');
                this.ionViewDidEnter();
              }
            } catch (error) {
              if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                  this.showToast(error.response?.data.message, 'danger');
                  return;
                }
                if (error.response?.status === 422) {
                  this.showToast('Não é possível desativar o administrador. Ainda há vagas associadas a ele', 'danger');
                  return;
                }
                if (error.response?.status === 500) {
                  this.showToast('Erro ao desativar administrador, por favor faça login novamente.', 'danger');
                  return;
                }
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async reativarPerfil(idAdministrador: number) {
    const alert = await this.alertController.create({
      header: 'Reativar Perfil',
      message: 'Tem certeza de que deseja reativar o perfil deste administrador?',
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
              const response = await api.put(`/reactivate-admin/${idAdministrador}`);
              if (response.status === 200) {
                console.log('Administrador reativado com sucesso');
                this.showToast('Administrador reativado com sucesso', 'success');
                this.carregarLista();
              } else {
                console.error('Erro ao reativar o administrador:', response.data.message);
                this.showToast('Erro ao reativar o administrador', 'danger');
              }
            } catch (error: any) {
              if (error.response.status === 409) {
                if (error.response.data.message.includes('email')) {
                  this.showToast('Não é possível reativar este perfil, já existe um administrador com o mesmo e-mail cadastrado.', 'danger');
                }
              } else {
                console.error('Erro ao reativar o administrador:', error);
                this.showToast('Erro ao reativar o administrador', 'danger');
              }
            }
          },
        },
      ],
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

  filtrarAdministradoresPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.administradores = [...this.originalAdministradores]; // Restaura as vagas originais
      return;
    }
    this.administradores = this.originalAdministradores.filter(administrador =>
      administrador.nome.toLowerCase().includes(termoPesquisa)
    );
  }
}
