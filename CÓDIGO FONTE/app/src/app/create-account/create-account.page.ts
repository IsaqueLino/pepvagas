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

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.checkTheme()
  }

  async submitAccount() {

    if (this.login.senha != this.login.senhaConfirmacao) {
      this.showMessage("As senhas não coincidem")
      return
    } else if (this.login.email == null || this.login.email.trim == "") {
      this.showMessage("Preencha o campo de email")
    } else if (this.login.senha == null || this.login.senha.trim == "") {
      this.showMessage("Preencha o campo de senha")
    } else if (this.login.senhaConfirmacao == null || this.login.senhaConfirmacao.trim == "") {
      this.showMessage("Preencha o campo de confirmação de senha")
    } else {
      const response = await this.authService.createAccount(this.login.email, this.login.senha, TipoUsuario.CANDIDATO)


      if (response.status == 201) {
        this.authService.setCreationUser(response.data.idConta)
        this.navController.navigateForward('cadastro-candidato')
      } else if (response.status == 409) {
        this.showMessage(response.response.data.message)
      }
    }
  }

  goBack() {
    this.navController.navigateRoot('login')
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
