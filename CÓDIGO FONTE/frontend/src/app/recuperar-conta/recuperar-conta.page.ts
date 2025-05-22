import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-conta',
  templateUrl: './recuperar-conta.page.html',
  styleUrls: ['./recuperar-conta.page.scss'],
})
export class RecuperarContaPage implements OnInit {

  email: string = ''

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.checkTheme()
  }


  async recoveryAccount(){
    const response = await this.authService.recovery(this.email)

    if(response.status == 200){
      this.showMessage('Um email foi enviado para você.')
      this.navController.navigateRoot('login')
    }else{
      this.showMessage(response.response.data.message ?? 'Erro interno do servidor')
    }
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

  cancel(){
    this.navController.navigateRoot("login")
  }
}
