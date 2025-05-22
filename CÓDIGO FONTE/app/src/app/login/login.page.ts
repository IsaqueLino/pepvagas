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

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private navigationController: NavController
  ) { 

    if (authService.getJwt() != null)
      this.navigationController.navigateRoot('home')
      console.log("Não é nulo!")
  }

  ngOnInit() {
    if (this.authService.getJwt() != null)
      this.navigationController.navigateRoot('home')

    this.checkTheme()
  }

  async ionViewWillEnter() {
    this.ngOnInit()
  }


  public async onSubmit() {

    const response = await this.authService.login(this.login.email, this.login.senha)
    

    if (response == null) {
      this.showMessage("Erro interno do servidor")
    } else if (response.status == 200){
      this.authService.setSession(response.data.token, response.data.id, response.data.tipo)
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
