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

  idEquipe: number = 0;
  equipe: any;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idEquipe = params['idEquipe'];
      this.carregarEquipePorId(this.idEquipe);
    });
  }

  async carregarEquipePorId(idEquipe: number) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.showToast('Você precisa estar logado para visualizar os administradores!', 'danger');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await api.get(`/find-equipe/${idEquipe}`, { headers });

      if (response.status === 200) {
        this.equipe = response.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
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
      duration: 2000, // Duração do toast em milissegundos (2 segundos neste exemplo)
      position: 'top', // Posição do toast na tela (pode ser 'top', 'middle' ou 'bottom')
      color: color, // Cor do toast (pode ser 'success', 'danger', etc.)
    });

    toast.present();
  }

}
