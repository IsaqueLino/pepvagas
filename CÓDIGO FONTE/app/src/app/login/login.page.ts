import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public login: any = {}
  public emailInvalid: boolean = false;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private navigationController: NavController
  ) { 

    if (authService.getJwt() != null)
      this.navigationController.navigateRoot('home')
  }

  ngOnInit() {
    if (this.authService.getJwt() != null)
      this.navigationController.navigateRoot('home')

    this.checkTheme()
  }

  async ionViewWillEnter() {
    this.ngOnInit()
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = this.login.email && !emailRegex.test(this.login.email);
  }


  public async onSubmit() {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(this.login.email == null || this.login.email.trim() == ''){
      this.showMessage("Email é requerido.")
      return
    } else if (!emailRegex.test(this.login.email)) {
      this.emailInvalid = true;
      this.showMessage("Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).")
      return
    } else if(this.login.senha == null || this.login.senha.trim() == '' || this.login.senha.length < 4){
      this.showMessage("Senha é requerida (no mínimo 4 caracteres).")
      return
    }

    if(this.login.email == null || this.login.email.trim() == ''){
      this.showMessage("Email é requerido.")
      return
    }else if(this.login.senha == null || this.login.senha.trim() == ''){
      this.showMessage("Senha é requerida.")
      return
    }

    const response = await this.authService.login(this.login.email, this.login.senha)
    

    if (response == null) {
      this.showMessage("Erro interno do servidor")
    } else if (response.status == 200){
      this.authService.setSession(response.data.token, response.data.id, response.data.tipo)
      this.showMessage("Bem-vindo ao PEPVagas!")
      this.navigationController.navigateForward('home')
    } else {
      this.showMessage(response.response.data.message)
    }

  }

  goTo(route: string){
    this.navigationController.navigateForward(route)
  }

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
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
