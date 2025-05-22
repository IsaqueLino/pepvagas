import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { AxiosError } from 'axios';
import { TipoUsuario } from '../../../../shared/enums/TipoUsuario';
import { api } from '../services/axios';

@Component({
  selector: 'app-recovery',
  templateUrl: 'recovery.page.html',
  styleUrls: ['recovery.page.scss'],
})
export class RecoveryPage {
  email: string = '';
  tipoUsuario: string = ''; 
  

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  onEmailChange(event: any) {
    this.email = event.target.value;
  }

  async onTipoUsuarioChange(event: any) {
    this.tipoUsuario = event.target.value;
    console.log(this.tipoUsuario);
  }

  async recuperarSenha() {
    try {

      if(this.tipoUsuario === 'default'){
        this.tipoUsuario = TipoUsuario.ADMINISTRADOR;
        return;
      }

      console.log(this.email, this.tipoUsuario);
      
      const response = await api.post('/forgot-password', {
        email: this.email,
        tipo: this.tipoUsuario,
      });

      if (response.status === 200) {
        const { message } = response.data;
        this.presentToast(message);
        this.navCtrl.navigateForward('/login');
      }
    } catch (error) {
      if(error instanceof AxiosError){
        this.presentToast(error.response?.data.message);
      }
    }
  }

  // Adicione um método para exibir um toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      color: 'dark',
      position: 'top',
    });
    toast.present();
  }

  // Adicione um método para voltar para a tela de login

  voltar() {
    this.navCtrl.navigateForward('/login');
  }
}
