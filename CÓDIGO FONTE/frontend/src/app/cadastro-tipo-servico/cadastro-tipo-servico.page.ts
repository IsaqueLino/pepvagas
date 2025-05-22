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

  public isDarkTheme: boolean = false
  public isLogged: boolean = false

  constructor(private formBuilder: FormBuilder, private authService: AuthService,private navController: NavController, private toastController: ToastController, private tipoService: TipoServicoService) { 
    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')
    
    
    this.obrigatorio = this.formBuilder.group({
      nome: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.handleTheme()

    if (this.authService.getJwt()){
      this.isLogged = true
    }
  }

  logout() {
    this.authService.logout()
    this.navController.navigateForward('login')
  }

  toggleTheme() {
    if (this.isDarkTheme)
      this.isDarkTheme = false
    else
      this.isDarkTheme = true

    this.handleTheme()
  }

  private handleTheme() {
    if (this.isDarkTheme) {
      document.body.setAttribute('color-scheme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
      localStorage.setItem('theme', 'light')
    }
  } 

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
  public async onSubmit(){
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
    console.log(response)

    if(response.status == 201){
      this.presentToast("Tipo de serviço cadastrado com sucesso")
      this.obrigatorio.reset()
    }

  }

}
