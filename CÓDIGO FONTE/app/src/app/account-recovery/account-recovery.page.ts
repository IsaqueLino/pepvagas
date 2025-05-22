import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.page.html',
  styleUrls: ['./account-recovery.page.scss'],
})
export class AccountRecoveryPage implements OnInit {

  email: string = ''

  constructor(
    private navController: NavController,
    private toastController: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.checkTheme()
  }

  async recoveryAccount(){
    const response = await this.authService.recovery(this.email)

    if(response.status == 200){
      this.showMessage('Um email foi enviado para você.', 'success')
      this.navController.navigateRoot('login')
    }else{
      this.showMessage(response.response.data.message ?? 'Erro interno do servidor', 'danger')
    }
  }

  async showMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color
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
