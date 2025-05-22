import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../../../../shared/enums/TipoUsuario'

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  public login: any = {}
  public emailTouched: boolean = false;


  constructor(
    private toastController: ToastController,
    
    private navController: NavController
  ) { }

  ngOnInit() {
    this.checkTheme()
  }

  async submitAccount() {

    if (!this.login.email || !this.validateEmail()) {
      this.showMessage("Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).");
      return;
    }
    if (this.login.senha != this.login.senhaConfirmacao) {
      this.showMessage("As senhas não coincidem.");
      return;
    } else if (this.login.email == null || this.login.email.trim() === "") {
      this.showMessage("Preencha o campo de email.");
      return;
    } else if (this.login.senha == null || this.login.senha.trim() === "") {
      this.showMessage("Preencha o campo de senha.");
      return;
    } else if (this.login.senha.length < 4) {
      this.showMessage("A senha deve ter no mímino 4 caracteres.")
      return;
    } else if (this.login.senhaConfirmacao == null || this.login.senhaConfirmacao.trim() === "") {
      this.showMessage("Preencha o campo de confirmação de senha.");
      return;
    } else {
      // Salvar email e senha no localStorage
      localStorage.setItem('candidato_email', this.login.email);
      localStorage.setItem('candidato_senha', this.login.senha);
      this.navController.navigateForward('cadastro-candidato');
    }
  }

  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.login.email);
  }
  

  goBack() {
    this.navController.navigateRoot('login')
  }

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    })

    toast.present()
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
    }
  }

}
