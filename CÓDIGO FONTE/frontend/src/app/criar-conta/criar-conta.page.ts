import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
})
export class CriarContaPage implements OnInit {

  public login: any = {}
  public emailInvalid: boolean = false; 

  constructor(
    private authService: AuthService,
    private navigationController: NavController,
    private toastController: ToastController
  ) {
    if (this.authService.getJwt() != null)
      this.navigationController.navigateRoot('home')
  }

  ngOnInit() {

    this.checkTheme()

    if (this.authService.getJwt() != null)
      this.navigationController.navigateRoot('home')
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = this.login.email && !emailRegex.test(this.login.email);
  }

  async onSubmit() {
    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.login.email)) {
      this.showMessage("Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).");
      return;
    }
    
    if (!this.login.email || !this.login.senha) {
      this.showMessage("O Email e a Senha são requeridos.");
    } else if (this.login.senha != this.login.confirmacaoSenha) {
      this.showMessage("As senhas não coincidem.");
    } else {

      if(this.login.senha.length < 4)
      {
        this.showMessage("A senha deve ter no mímino 4 caracteres.")
        return;
      }

      const type = this.authService.getType();
  
      if (type) {
        const conta = await this.authService.getAccountByEmail(this.login.email);
  
        if(conta.status == 206){
          this.showMessage("Já existe uma conta ativa com esse email de login.");
        }else{
          sessionStorage.setItem("email", this.login.email);
          sessionStorage.setItem("pass", this.login.senha);
  
          switch (type) {
            case 'C':
              this.navigationController.navigateForward("cadastro-candidato");
              break;
            case 'E':
              this.navigationController.navigateRoot("/cadastro-empresa");
              break;
            case 'L':
              this.navigationController.navigateRoot("/profissional-liberal-cadastro");
              break;
          }
        }
      }
    }
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
