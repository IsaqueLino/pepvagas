import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminData } from '../../adminData';
import { api } from 'src/app/services/axios';
import { AlertController, NavController, ToastController } from '@ionic/angular'; // Importe o ToastController
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoUsuario } from '../../../../../../shared/enums/TipoUsuario';
import { AxiosError } from 'axios';
import { MaskService } from 'src/app/services/mask.service';
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  @ViewChild('nomeInput') nomeInput: any;

  admin: AdminData = {
    nome: '',
    email: '',
    senha: '',
    tipo: 'Administrador',
    updateBy: ''
  };

  public type = 'password';
  public showPass = false;
  public emailValido = false;
  public nomeValido = false;
  public checkSenha: string = '';

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController,
    public maskService: MaskService
  ) {

    }

  ngOnInit() {
  }

  formValido() {
    if(this.admin.nome == ''){
      this.showAlert('Campos Obrigatórios', 'Nome do Representante não informado.')
      return false;
    } else if(!this.nomeValido){
      this.showAlert('Campos Obrigatórios', 'Nome inválido.')
      return false;
    } else if(this.admin.senha == ''){
      this.showAlert('Campos Obrigatórios', 'Senha não informada.')
      return false;
    } else if(this.admin.email == ''){
      this.showAlert('Campos Obrigatórios', 'Email não informado.')
      return false;
    } else if(!this.emailValido){
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if (!(this.admin.senha === this.checkSenha && this.senhaRequisitos.lengthCheck && this.senhaRequisitos.upperLowerCheck && this.senhaRequisitos.numberCheck && this.senhaRequisitos.specialCharCheck)) {
      this.showAlert('Campos Obrigatórios', 'Senhas inválida.')
      return false;
    } else{
      return true;
    }
  }

  async cadastrarADM() {
    if (await this.formValido()) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.navCtrl.navigateRoot('/login');
          return;
        }
  
        const headers = {
          'Authorization': `Bearer ${token}`
        };
  
        const response = await api.post('/create-admin', this.admin, { headers });
        if (response.status === 201) {
          this.navCtrl.navigateForward('/listar-adm');
          this.showToast('Administrador cadastrado com sucesso', 'success');
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
          this.showToast('Já existe um administrador com o mesmo e-mail cadastrado', 'danger');
        } else if (error.response?.status === 401) {
          this.navCtrl.navigateRoot('/login');
        } else {
          console.error('Erro ao cadastrar o administrador:', error);
          this.showToast('Erro ao cadastrar o administrador', 'danger');
        }
      }
    }
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

  async showAlert(cabecalho:string,mensagem:string){
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
    this.senhaRequisitos.lengthCheck = this.admin.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.admin.senha) && /[A-Z]/.test(this.admin.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.admin.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç_,"+-]/.test(this.admin.senha);
  }

  verificarEmail(): void {

    this.admin.email = this.admin.email.toLowerCase();
    this.admin.email = this.admin.email.trim();

    if (this.admin.email.includes('@') && this.admin.email.includes('.')) {
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

  cancelar(){
    this.navCtrl.pop();
  }
}
