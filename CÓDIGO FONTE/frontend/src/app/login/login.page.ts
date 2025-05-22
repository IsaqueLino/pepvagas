import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public login: any = {}
  public isDarkTheme = false
  public isLoading = false

  constructor(
    private authService: AuthService,
    private navigationController: NavController,
    private toastController: ToastController,
  ) { 
    if (this.authService.getJwt() != null)
      this.navigationController.navigateRoot('home')

    this.checkTheme()
  }

  ngOnInit() {
    if (this.authService.getJwt() != null)
      this.navigationController.navigateRoot('home')


    setTimeout(() => {
      let theme = localStorage.getItem('theme') ?? ''
      this.login = {}
      localStorage.clear()
      sessionStorage.clear()
      localStorage.setItem('theme', theme)
    }, 500)
    this.checkTheme()
  }


  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
      this.isDarkTheme = true
    } else {
      document.body.setAttribute('color-scheme', 'light')
      this.isDarkTheme = false
    }
  }

  public async onSubmit() {

    this.isLoading = true

    if(this.login.email == null || this.login.email.trim() == ''){
      this.showMessage("Email é requerido.")
      this.isLoading = false
      return
    }else if(this.login.senha == null || this.login.senha.trim() == ''){
      this.showMessage("Senha é requerida.")
      this.isLoading = false
      return
    }


    const response = await this.authService.login(this.login.email, this.login.senha)
    console.log(response)

    if (response == null) {
      this.showMessage("Erro interno do servidor")
    } else if (response.status == 200){
      this.authService.setSession(response.data.token, response.data.id, response.data.tipo)
      this.showMessage("Bem-vindo ao PEPVagas!")
      this.navigationController.navigateRoot('home')
    } else {
      this.showMessage(response.response.data.message)
    }
    this.isLoading = false

  }

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    })

    toast.present()
  }

}
