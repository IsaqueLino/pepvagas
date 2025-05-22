import { Component, OnInit } from '@angular/core';
import {AlertController, NavController, PopoverController, ToastController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {MaskService} from "../../../services/mask.service";
import {api} from "../../../services/axios";
import {AxiosError} from "axios";
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  private id: any = 0;
  private thisUser: any = undefined;

  public checkSenha: string = '';

  public senha: string = '';

  public showPass: boolean = false;

  public type = 'password';

  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private popoverController: PopoverController,
    public maskService: MaskService
  ) { }


  ngOnInit() {

  }

  customCounterFormatter(inputLenght: number, maxLength: number) {
    return 'Restam ' + (maxLength - inputLenght) + ' caracteres';
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.senha) && /[A-Z]/.test(this.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç,"+-]/.test(this.senha);
  }

  /**
   * Verifica se a senha atende aos requisitos
   *
   * @returns {boolean} * Retorna true se a senha atende aos requisitos
   */
  checkSenhaRequisitos(){
    this.verificarRequisitosSenha();
    if(!this.senhaRequisitos.lengthCheck) {
      this.showAlert('Atenção', 'A senha deve conter no mínimo 6 caracteres')
      return true;
    }else if(!this.senhaRequisitos.upperLowerCheck) {
      this.showAlert('Atenção', 'A senha deve conter letras maiúsculas e minúsculas')
      return true;
    } else if(!this.senhaRequisitos.numberCheck) {
      this.showAlert('Atenção', 'A senha deve conter números')
      return true;
    } else if(!this.senhaRequisitos.specialCharCheck) {
      this.showAlert('Atenção', 'A senha deve conter caracteres especiais')
      return true;
    }else {
      return false;
    }
  }

  /**
   * Envia os dados para o servidor para alterar a senha
   */
  async doUpdate() {
    this.id = localStorage.getItem('userId');
    this.thisUser = localStorage.getItem('userType');
    if(this.thisUser != TipoUsuario.LIBERAL) {
      return;
    }
    try {
      // if(this.checkSenhaRequisitos()) {
      //   return;
      // }
      if(this.senha != this.checkSenha) {
        this.showAlert('Atenção', 'As senhas não coincidem')
        return;
      }

      const response =  await api.put(`/password-profissional/${this.id}`, {senha: this.senha});

      console.log(response)

      this.showAlert('Sucesso', 'Senha alterada com sucesso')


      this.navCtrl.back();

    }catch (error) {
      if(error instanceof AxiosError){
        console.log(error)
        if(error.response?.data.message == "Senha igual"){
          this.showAlert('Atenção', 'A sua senha é a mesma que a anterior, por favor digite outra')
        }else{
          this.showToast(error.response?.data.message, 'danger');
        }
      }else {
        this.showToast('Erro ao alterar senha', 'danger');
        console.log('error:', error)
      }


      return;
    }


  }

  /**
   * Volta para a tela anterior
   */
  doCancel() {
    this.navCtrl.back();
  }

  /**
   * Exibe um toast na tela com a mensagem passada por parametro
   * @param mensagem * Mensagem do toast
   * @param color * Cor do toast
   */
  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000, // Duração do toast em milissegundos (2 segundos neste exemplo)
      position: 'top', // Posição do toast na tela (pode ser 'top', 'middle' ou 'bottom')
      color: color, // Cor do toast (pode ser 'success', 'danger', etc.)
    });

    toast.present();
  }

  /**
   * Exibe um alerta na tela com o titulo e mensagem passados por parametro
   * @param header * Cabeçalho do alerta
   * @param message * Mensagem do alerta
   */
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
