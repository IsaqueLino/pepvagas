import { Component, OnInit } from '@angular/core';
import { api } from "../../../services/axios";
import { AlertController, NavController, ToastController } from "@ionic/angular";
import { CandidatoData } from "../../candidatoData";
import { AxiosError } from "axios";

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  candidatos: any[] = [];
  candidato: any;
  originalCandidatos: any[] = [];
  termoPesquisa: string = '';

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.ionViewDidEnter();
  }

  carregarLista() {
    api.get('/list-all-candidatos')
      .then(response => {
        // Armazenar a lista de administradores na propriedade
        this.candidatos = response.data;
        this.originalCandidatos = [...this.candidatos];
      })
      .catch(error => {
        // Lidar com erros aqui
        console.error('Erro:', error);
      });
  }

  navegarParaAlterar(id: number) {
    this.navCtrl.navigateForward('/alterar-candidato', {
      queryParams: {
        "id": id
      }
    });
  }

  navegarParaVisualizar(id: number) {
    this.navCtrl.navigateForward('/visualizar-candidato', {
      queryParams: {
        "id": id
      }
    });
  }

  async deletarCandidato(idCandidato: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja desativar este candidato?',
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
                this.showToast('Você precisa estar logado para desativar o candidato!', 'danger');
                return;
              }

              const headers = {
                'Authorization': `Bearer ${token}`
              };

              const response = await api.delete(`/delete-candidato/${idCandidato}`, { headers });

              if (response.status === 200) {
                this.showToast('Candidato desativado com sucesso!', 'success');
                this.carregarLista();
              }
            } catch (error: any) {
              if (error.response.status === 409) {
                if (error.response.data.message.includes('email')) {
                  this.showToast('Não é possível reativar este perfil, já existe um candidato com o mesmo e-mail cadastrada.', 'danger');
                } else if (error.response.data.message.includes('CPF')) {
                  this.showToast('Não é possível reativar este perfil, pois já existe um candidato com o mesmo CPF cadastrado.', 'danger');
                }
              } else {
                // Outros erros
                console.error('Erro ao reativar o candidato:', error);
                this.showToast('Erro ao reativar o candidato', 'danger');
              }
            }
          },
        },
      ],
    });
    await alert.present();
  }


  adicionarNovoCandidato() {
    this.navCtrl.navigateForward('/cadastro-candidato');
  }

  async reativarPerfil(idCandidato: number) {
    const alert = await this.alertController.create({
      header: 'Reativar Perfil',
      message: 'Tem certeza de que deseja reativar o perfil deste candidato?',
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
              const response = await api.put(`/reactivate-candidato/${idCandidato}`);
              if (response.status === 200) {
                console.log('Candidato reativado com sucesso');
                this.showToast('Candidato reativado com sucesso', 'success');
                this.carregarLista();
              } else {
                console.error('Erro ao reativar o candidato:', response.data.message);
                this.showToast('Erro ao reativar o candidato', 'danger');
              }
            } catch (error: any) {
              if (error.response.status === 409) {
                if (error.response.data.message.includes('email')) {
                  this.showToast('Não é possível reativar este perfil, já existe um candidato com o mesmo e-mail cadastrada.', 'danger');
                } else if (error.response.data.message.includes('CPF')) {
                  this.showToast('Não é possível reativar este perfil, pois já existe um candidato com o mesmo CPF cadastrada.', 'danger');
                }
              } else {
                console.error('Erro ao reativar o candidato:', error);
                this.showToast('Erro ao reativar o candidato', 'danger');
              }
            }
          },
        },
      ],
    });
    await alert.present();
  }

  filtrarCandidatosPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.candidatos = [...this.originalCandidatos]; // Restaura as vagas originais
      return;
    }
    this.candidatos = this.originalCandidatos.filter(candidato =>
      candidato.nome.toLowerCase().includes(termoPesquisa)
    );
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
}
