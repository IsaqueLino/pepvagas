import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { TipoServicoService } from '../services/tipo-servico.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cadastro-tipo-servico',
  templateUrl: './cadastro-tipo-servico.page.html',
  styleUrls: ['./cadastro-tipo-servico.page.scss'],
})
export class CadastroTipoServicoPage implements OnInit {

  obrigatorio: FormGroup;

  public isLogged: boolean = false

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private navController: NavController, private toastController: ToastController, private tipoService: TipoServicoService) {
    if (this.authService.getJwt() == null)
      this.navController.navigateRoot('login')


    this.obrigatorio = this.formBuilder.group({
      nome: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.checkTheme()

    if (this.authService.getJwt()) {
      this.isLogged = true
    }
  }

  logout() {
    this.authService.logout()
    this.navController.navigateForward('login')
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public async onSubmit() {
    if (this.obrigatorio.invalid) {
      Object.keys(this.obrigatorio.controls).forEach(key => {
        const control = this.obrigatorio.get(key);
        if (control !== null && control !== undefined && control.invalid) {
          if (control.errors && control.errors['required']) {
            this.presentToast(`O campo ${key} é obrigatório. Por favor, preencha-o.`);
          }
        }
      });
      return;
    }

    const response = await this.tipoService.cadastrarTipo(this.obrigatorio.value["nome"])

    if (response.status == 201) {
      this.presentToast("Tipo de serviço cadastrado com sucesso!")
      this.obrigatorio.reset()
    }

    this.navController.back(); // Volta para a página anterior

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
