import { Component, OnInit } from '@angular/core';
import { RepresentanteData } from '../../representanteData';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  representante: RepresentanteData = {
    nome: '',
    email: '',
    senha: '',
    tipo: 'Representante',
    idEmpresa: 0 
  };

  userId: any;
  public type = 'password';
  public showPass = false;
  public emailValido = false;
  public nomeValido = false;
  public checkSenha: string = '';

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService,
    ) {
      this.userId = localStorage.getItem('userId')
    }

  ngOnInit() {
    
  }

  async formValido() {
    if(this.representante.nome == ''){
      this.showAlert('Campos Obrigatórios', 'Nome do Representante não informado.')
      return false;
    } else if(!this.nomeValido){
      this.showAlert('Campos Obrigatórios', 'Nome inválido.')
      return false;
    } else if(this.representante.senha == ''){
      this.showAlert('Campos Obrigatórios', 'Senha não informada.')
      return false;
    } else if(this.representante.email == ''){
      this.showAlert('Campos Obrigatórios', 'Email não informado.')
      return false;
    } else if(!this.emailValido){
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if (!(this.representante.senha === this.checkSenha && this.senhaRequisitos.lengthCheck && this.senhaRequisitos.upperLowerCheck && this.senhaRequisitos.numberCheck && this.senhaRequisitos.specialCharCheck)) {
      this.showAlert('Campos Obrigatórios', 'Senhas inválido.')
      return false;
    } else{
      return true;
    }
  }

  async cadastrarRepresentante() {
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
  
        this.representante.idEmpresa = parseInt(this.userId, 10);
        const response = await api.post('/create-representante', this.representante, { headers });
  
        this.navCtrl.navigateForward('/listar-representantes');
        this.showToast('Representante cadastrado com sucesso', 'success');
      } catch (error: any) {
        if (error.response?.status === 409) {
          this.showToast('Já existe um representante com o mesmo e-mail cadastrada', 'danger');
        } else if (error.response?.status === 401) {
          // Adicione lógica adicional para tratar o erro de não autorizado (401) se necessário
          this.navCtrl.navigateRoot('/login');
        } else {
          console.error('Erro ao cadastrar o representante:', error);
          this.showToast('Erro ao cadastrar o representante', 'danger');
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
    this.senhaRequisitos.lengthCheck = this.representante.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.representante.senha) && /[A-Z]/.test(this.representante.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.representante.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç_,"+-]/.test(this.representante.senha);
  }

  verificarEmail(): void {

    this.representante.email = this.representante.email.toLowerCase();
    this.representante.email = this.representante.email.trim();

    if (this.representante.email.includes('@') && this.representante.email.includes('.')) {
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
