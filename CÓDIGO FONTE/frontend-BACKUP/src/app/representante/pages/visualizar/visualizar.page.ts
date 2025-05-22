import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {

  idRepresentante: number = 0;
  representante: any = {};
  
  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    this.ionViewDidEnter();
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.idRepresentante = params['idRepresentante'];
      this.carregarRepresentantePorId(this.idRepresentante);
    });
  }

  async carregarRepresentantePorId(idRepresentante: number) {
    try {
      const response = await api.get(`/find-representante/${idRepresentante}`); // Substitua '/find' pela rota real em seu servidor
      this.representante = response.data;
    } catch (error) {
      console.error('Erro ao carregar o representante:', error);
      this.showToast('Erro ao carregar o representante', 'danger');
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
