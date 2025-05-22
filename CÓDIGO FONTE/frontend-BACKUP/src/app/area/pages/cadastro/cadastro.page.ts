import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { AreaData } from '../../areaData';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  area: AreaData = {
    nome: '',
  };

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {

  }

  async formValido() {
    if (this.area.nome == '') {
      this.showAlert('Campos Obrigatórios', 'Nome da Área não informado.')
      return false;
    } else {
      return true;
    }
  }

  async cadastrarArea() {
    if (await this.formValido()) {
      try {
        const response = await api.post('/create-area', this.area);
        this.navCtrl.navigateForward('/listar-areas');
        this.showToast('Área cadastrada com sucesso', 'success');
      } catch (error: any) {
        if (error.response?.status === 422) {
          console.error('Área já cadastrada:', error);
          this.showToast('Área já cadastrada', 'danger');
        } else {
          console.error('Erro ao cadastrar a área:', error);
          this.showToast('Erro ao cadastrar a área', 'danger');
        }
      }
    }
  }

  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000, // Duração do toast em milissegundos (2 segundos neste exemplo)
      position: 'top', // Posição do toast na tela (pode ser 'top', 'middle' ou 'bottom')
      color: color, // Cor do toast (pode ser 'success', 'danger', etc.)
    });
    toast.present();
  }

  async showAlert(cabecalho: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  cancelar() {
    this.navCtrl.pop();
  }
}
