import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { AxiosError } from 'axios';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil-alterar',
  templateUrl: './perfil-alterar.page.html',
  styleUrls: ['./perfil-alterar.page.scss'],
})
export class PerfilAlterarPage implements OnInit {
  id: any;
  equipe = {
    nome: '',
    email: '',
    tipo: '',
    senha: '',
  }

  senha = {
    senhaAtual: '',
    novaSenha: '',
  }

  checkSenha: boolean = false;
  confirmarSenha: string = '';

  selectedTab: string = 'alterar-nome';

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }


  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController
  ) { }

    ngOnInit() {
      this.id = localStorage.getItem('userId');
      this.getUsuarioPorId(this.id);
      }


  async getUsuarioPorId(id: any) {
    try {

      this.id = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!token) {
        this.showToast('Você precisa estar logado para visualizar seu perfil!', 'danger');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await api.get(`/find-equipe/${id}`, { headers });

      if (response.status === 200) {
        this.equipe = {
          nome: response.data.nome,
          email: response.data.email,
          tipo: response.data.tipo,
          senha: ''
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
        if (error.response?.status === 500) {
          this.showToast('Erro ao carregar perfil, por favor faça login novamente.', 'danger');
          return;
        }
      }

    }
  }

  public type = 'password';
  public showPass = false;
  public emailValido = false;
  public nomeValido = false;
  
  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  
  onSenhaChange(event: any) {
    this.confirmarSenha = event.target.value;
  }
  
  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };

  verificarSenhasIguais(): void {
    if (this.senha.novaSenha === this.confirmarSenha) {
      this.checkSenha = true;
    } else {
      this.checkSenha = false;
    }
  }

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.senha.novaSenha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.senha.novaSenha) && /[A-Z]/.test(this.senha.novaSenha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.senha.novaSenha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç,"+-]/.test(this.senha.novaSenha);
  }

  async alterar() {
    try {
      this.id = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!token) {
        this.showToast('Você precisa estar logado para alterar seu perfil!', 'danger');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await api.put(`/update-equipe/${this.id}`, this.equipe, { headers });

      if (response.status === 200) {
        this.showToast('Perfil alterado com sucesso!', 'success');
        this.navCtrl.navigateRoot('/home');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
        if(error.response?.status === 409) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
        if (error.response?.status === 500) {
          this.showToast('Erro ao alterar perfil, por favor faça login novamente.', 'danger');
          return;
        }
      }
      console.log(error);
    }
  }

  async alterarSenha() {
    try {

      if (this.senha.novaSenha !== this.confirmarSenha) {
        this.showToast('As senhas não conferem!', 'danger');
        return;
      }

      this.id = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!token) {
        this.showToast('Você precisa estar logado para alterar sua senha!', 'danger');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await api.put(`/update-password-equipe/${this.id}`, this.senha, { headers });

      if (response.status === 200) {
        console.log(response.data);
        this.showToast('Senha alterada com sucesso!', 'success');
        this.navCtrl.navigateRoot('/home');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
        if(error.response?.status === 409) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
        if (error.response?.status === 500) {
          this.showToast('Erro ao alterar senha, por favor faça login novamente.', 'danger');
          return;
        }
      }
      console.log(error);
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

}
