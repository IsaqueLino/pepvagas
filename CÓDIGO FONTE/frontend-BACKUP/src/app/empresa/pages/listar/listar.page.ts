import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { api } from 'src/app/services/axios';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  empresas: any[] = [];
  originalEmpresas: any[] = [];
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
    api.get('/list-empresas')
      .then(response => {
        this.empresas = response.data;
        this.originalEmpresas = [...this.empresas];
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  navegarParaAlterar(idEmpresa: number) {
    this.navCtrl.navigateForward('/alterar-empresa', {
      queryParams: {
        "idEmpresa": idEmpresa
      }
    });
  }

  navegarParaVisualizar(idEmpresa: number) {
    this.navCtrl.navigateForward('/visualizar-empresa', {
      queryParams: {
        "idEmpresa": idEmpresa
      }
    });
  }

  adicionarNovaEmpresa() {
    this.navCtrl.navigateForward('/cadastro-empresa');
  }

  async deletarEmpresa(idEmpresa: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja desativar esta empresa?',
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
            api.delete(`/delete-empresa/${idEmpresa}`)
              .then(response => {
                this.empresas = this.empresas.filter(empresa => empresa.idEmpresa !== idEmpresa);
                this.showToast('Empresa desativada', 'success');
                this.carregarLista();
              })
              .catch(error => {
                if (error.response.status === 400) {
                  this.showToast('Não é possível desativar a empresa, ela ainda possui representantes ativos', 'danger');
                } else if (error.response.status === 401) {
                  this.showToast('Não é possível desativar a empresa, ela ainda possui vagas ativas', 'danger');
                } else {
                  console.error('Erro ao desativar empresa:', error);
                  this.showToast(`Erro ao desativar empresa: ${error}`, 'danger');
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

  formatarCNPJ(cnpj: bigint): string {
    return cnpj.toString().replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  async reativarPerfil(idEmpresa: number) {
    const alert = await this.alertController.create({
      header: 'Reativar Perfil',
      message: 'Tem certeza de que deseja reativar o perfil desta empresa?',
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
              const response = await api.put(`/reactivate-empresa/${idEmpresa}`);
              if (response.status === 200) {
                console.log('Empresa reativada com sucesso');
                this.showToast('Empresa reativada com sucesso', 'success');
                this.carregarLista();
              } else {
                console.error('Erro ao reativar a empresa:', response.data.message);
                this.showToast('Erro ao reativar a empresa', 'danger');
              }
            } catch (error: any) {
              if (error.response.status === 409) {
                // Tratamento para conflitos (por exemplo, email ou CNPJ duplicado)
                if (error.response.data.message.includes('email')) {
                  this.showToast('Não é possível reativar este perfil, já existe uma empresa com o mesmo e-mail cadastrada.', 'danger');
                } else if (error.response.data.message.includes('CNPJ')) {
                  this.showToast('Não é possível reativar este perfil, pois já existe uma empresa com o mesmo CNPJ cadastrada.', 'danger');
                }
              } else {
                // Outros erros
                console.error('Erro ao reativar a empresa:', error);
                this.showToast('Erro ao reativar a empresa', 'danger');
              }
            }
          },
        },
      ],
    });
    await alert.present();
  }

    
  filtrarEmpresasPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.empresas = [...this.originalEmpresas]; // Restaura as vagas originais
      return;
    }
    this.empresas = this.originalEmpresas.filter(empresa =>
      empresa.nomeEmpresa.toLowerCase().includes(termoPesquisa) ||
      empresa.cnpj.toString().replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5').toLowerCase().includes(termoPesquisa)
    );
  }
}
