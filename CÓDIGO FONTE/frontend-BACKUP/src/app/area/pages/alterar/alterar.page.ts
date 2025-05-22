import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { api } from 'src/app/services/axios';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.page.html',
  styleUrls: ['./alterar.page.scss'],
})
export class AlterarPage implements OnInit {


  idArea: number = 0;
  area: any = {};
  nomeNovo: string = "";

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idArea = params['idArea'];
      this.carregarAreaPorId(this.idArea);
    });
  }

  async carregarAreaPorId(idArea: number) {
    try {
      const response = await api.get(`/find-area/${idArea}`);
      this.area = response.data;
      this.nomeNovo = this.area.nome;
    } catch (error) {
      console.error('Erro ao carregar a area:', error);
      this.showToast('Erro ao carregar a area', 'danger');
    }
  }

  async formValido() {
    if (this.nomeNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Nome da Empresa não informado.')
      return false;
    } else {
      return true;
    }
  }

  async alterarArea() {
    if (await this.formValido()) {
      try {
        const dadosDeAlteracao = {
          nome: this.nomeNovo
        };
        const response = await api.put(`/update-area/${this.idArea}`, dadosDeAlteracao);
        this.navCtrl.navigateForward('/listar-areas');
        this.showToast('Dados alterados com sucesso', 'success');
      } catch (error: any) {
        if (error.response.status === 422) {
          this.showToast('Não é possível alterar a área, pois já existe uma área com o mesmo nome', 'danger');
        } else {
          console.error('Erro ao alterar a área:', error);
          this.showToast('Erro ao alterar a área', 'danger');
        }
      }
    }
  }

  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
      color: color,
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

  cancelar(){
    this.navCtrl.pop();
  }
}
