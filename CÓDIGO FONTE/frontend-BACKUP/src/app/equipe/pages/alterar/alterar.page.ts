import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.page.html',
  styleUrls: ['./alterar.page.scss'],
})
export class AlterarPage implements OnInit {
  idEquipe: number = 0;
  equipe: any = {};
  token = localStorage.getItem('token');
  nomeNovo: string = "";
  emailNovo: string = "";
  senhaNova: string = '';

  public type = 'password';
  public showPass = false;
  public emailValido = true;
  public nomeValido = true;
  public checkSenha: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { this.token = localStorage.getItem('token'); }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idEquipe = params['idEquipe'];
      this.carregarMembroDaEquipePorId(this.idEquipe);
    });
  }

  async carregarMembroDaEquipePorId(idEquipe: number) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.token}`
      };
      const response = await api.get(`/find-equipe/${idEquipe}`, { headers });
      if (response.status === 200) {
        this.equipe = response.data;
        this.nomeNovo = this.equipe.nome;
        this.emailNovo = this.equipe.email;
        //this.senhaNova = this.equipe.senha;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        } else {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
      }
      console.error('Erro ao carregar o administrador:', error);
      this.showToast('Erro ao carregar o administrador', 'danger');
    }
  }

  async formValido() {
    if (this.nomeNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Nome do Administrador não informado.')
      return false;
    } else if (!this.nomeValido) {
      this.showAlert('Campos Obrigatórios', 'Nome inválido.')
      return false;
    } else if (this.emailNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Email não informado.')
      return false;
    } else if (!this.emailValido) {
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if ((this.senhaNova!='' && this.checkSenha!='') && !(this.senhaNova === this.checkSenha && this.senhaRequisitos.lengthCheck && this.senhaRequisitos.upperLowerCheck && this.senhaRequisitos.numberCheck && this.senhaRequisitos.specialCharCheck)) {
      this.showAlert('Campos Obrigatórios', 'Senha inválida.')
      return false;
    } else {
      console.log(this.nomeNovo);
      return true;
    }
  }

  async alterarEquipe() {
    if (await this.formValido()) {
      try {
        if (!this.token) {
          this.showToast('Você precisa estar logado para alterar o membro de equipe!', 'danger');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${this.token}`
        };

        const response = await api.put(`/update-equipe/${this.idEquipe}`, {
          nome: this.nomeNovo,
          email: this.emailNovo,
          senha: this.senhaNova
        }, { headers });

        if (response.status === 200) {
          this.showToast('Membro de Equipe alterado com sucesso!', 'success');
          this.navCtrl.navigateForward('/listar-equipe');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            this.showToast(error.response?.data.message, 'danger');
            return;
          }
          if (error.response?.status === 409) {
            this.showToast(error.response?.data.message, 'danger');
            return;
          }
          if (error.response?.status === 500) {
            this.showToast('Erro ao alterar o membro de equipe, por favor faça login novamente.', 'danger');
            return;
          }
        }
      }
    }
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

  async showAlert(cabecalho: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.senhaNova.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.senhaNova) && /[A-Z]/.test(this.senhaNova);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.senhaNova);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç_,"+-]/.test(this.senhaNova);
  }

  verificarEmail(): void {

    this.emailNovo = this.emailNovo.toLowerCase();
    this.emailNovo = this.emailNovo.trim();

    if (this.emailNovo.includes('@') && this.emailNovo.includes('.')) {
      this.emailValido = true;
    } else {
      this.emailValido = false;
    }

  }

  bloquearNumeros(event: any): boolean {
    const input = event.target.value;
    const regex = /[0-9]/g; // Expressão regular para verificar números

    if (regex.test(input)) {
      return this.nomeValido = false;
    }
    return this.nomeValido = true;
  }

  cancelar() {
    this.navCtrl.pop();
  }
}
