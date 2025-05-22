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

  async onSubmit() {

    if (this.login.email == '') {
      this.showMessage("Email requerido")
    } else if (this.login.senha != this.login.confirmacaoSenha) {
      this.showMessage("A senha e a confirmação de senha devem ser iguais")
    } else {
      const type = this.authService.getType()

      if (type) {

        
        // const response = await this.authService.createAccount(this.login.email, this.login.senha, type)
        
        const conta = await this.authService.getAccountByEmail(this.login.email)

        if(conta.status == 206){
          this.showMessage("Esta conta já existe")
        }else{
          sessionStorage.setItem("email", this.login.email)
          sessionStorage.setItem("pass", this.login.senha)

          switch (type) {
            case 'C':
              this.navigationController.navigateForward("cadastro-candidato")
              break;
            case 'E':
              this.navigationController.navigateRoot("/cadastro-empresa")
              break;
            case 'L':
              this.navigationController.navigateRoot("/profissional-liberal-cadastro")
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
