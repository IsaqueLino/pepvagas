import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cadastro-selecionar-tipo',
  templateUrl: './cadastro-selecionar-tipo.page.html',
  styleUrls: ['./cadastro-selecionar-tipo.page.scss'],
})
export class CadastroSelecionarTipoPage implements OnInit {

  public login: any = {}

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

  onSubmit(tipo: string) {
    console.log("Clicou no submit " + tipo)
    switch (tipo) {
      case 'C':
        this.authService.setType('C')
        break;
      case 'E':
        this.authService.setType('E')
        break;
      case 'L':
        this.authService.setType('L')
        break;
    }

    this.navigationController.navigateForward('/criar-conta')
  }
}
