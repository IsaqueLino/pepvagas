import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {

  idAdministrador: number = 0;
  admin: any;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idAdministrador = params['idAdministrador'];
      this.carregarAdministradorPorId(this.idAdministrador);
    });
  }

  async carregarAdministradorPorId(idAdministrador: number) {
    try {
       const token = localStorage.getItem('token');

        if (!token) {
          this.navCtrl.navigateRoot('/login');
          return;
        }

        const response = await api.get(`/find-admin/${idAdministrador}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          this.admin = response.data;
        } 
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.navCtrl.navigateRoot('/login');
          return;
        }
        if (error.response?.status === 500) {
          this.showToast('Erro ao carregar administrador, por favor faça login novamente.', 'danger');
          return;
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

}
