import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipeData } from '../../equipeData';
import { api } from 'src/app/services/axios';
import { AlertController, NavController, ToastController } from '@ionic/angular'; // Importe o ToastController
import { TipoUsuario } from '../../../../../../shared/enums/TipoUsuario';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  @ViewChild('nomeInput') nomeInput: any;

  equipe: EquipeData = {
    nome: '',
    email: '',
    senha: '',
    tipo: TipoUsuario.EQUIPE
  };

  public type = 'password';
  public showPass = false;
  public emailValido = false;
  public nomeValido = false;
  public checkSenha: string = '';

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  formValido() {
    if(this.equipe.nome == ''){
      this.showAlert('Campos Obrigatórios', 'Nome do Representante não informado.')
      return false;
    } else if(!this.nomeValido){
      this.showAlert('Campos Obrigatórios', 'Nome inválido.')
      return false;
    } else if(this.equipe.senha == ''){
      this.showAlert('Campos Obrigatórios', 'Senha não informada.')
      return false;
    } else if(this.equipe.email == ''){
      this.showAlert('Campos Obrigatórios', 'Email não informado.')
      return false;
    } else if(!this.emailValido){
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if (!(this.equipe.senha === this.checkSenha && this.senhaRequisitos.lengthCheck && this.senhaRequisitos.upperLowerCheck && this.senhaRequisitos.numberCheck && this.senhaRequisitos.specialCharCheck)) {
      this.showAlert('Campos Obrigatórios', 'Senhas inválida.')
      return false;
    } else{
      return true;
    }
  }

  async cadastrarEquipe() {
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
  
        const response = await api.post('/create-equipe', this.equipe, { headers });
        if (response.status === 201) {
          this.navCtrl.navigateForward('/listar-equipe');
          this.showToast('Membro de Equipe cadastrado com sucesso', 'success');
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
          this.showToast('Já existe um membro de equipe com o mesmo e-mail cadastrado', 'danger');
        } else if (error.response?.status === 401) {
          this.navCtrl.navigateRoot('/login');
        } else {
          console.error('Erro ao cadastrar o membro de equipe:', error);
          this.showToast('Erro ao cadastrar o membro de equipe', 'danger');
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
    this.senhaRequisitos.lengthCheck = this.equipe.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.equipe.senha) && /[A-Z]/.test(this.equipe.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.equipe.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç_,"+-]/.test(this.equipe.senha);
  }

  verificarEmail(): void {

    this.equipe.email = this.equipe.email.toLowerCase();
    this.equipe.email = this.equipe.email.trim();

    if (this.equipe.email.includes('@') && this.equipe.email.includes('.')) {
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
