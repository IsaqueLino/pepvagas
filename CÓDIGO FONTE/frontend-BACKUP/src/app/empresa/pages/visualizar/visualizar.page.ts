import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { MaskService } from 'src/app/services/mask.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {

  idEmpresa: number = 0;
  empresa: any = {};
  area: any = {};
  cep: any
  cnpj: any
  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    public maskService: MaskService
  ) {
  }

  ngOnInit(): void {
    this.ionViewDidEnter();
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.idEmpresa = params['idEmpresa'];
      this.carregarEmpresaPorId(this.idEmpresa);
    });
  }

  async carregarEmpresaPorId(idEmpresa: number) {
    try {
      const responseEmpresa = await api.get(`/find-empresa/${idEmpresa}`);
      this.empresa = responseEmpresa.data;
      // Máscara para CEP
      this.cep = this.empresa.cep.toString().replace(/^(\d{5})(\d{3})$/, '$1-$2');
      // Máscara para CNPJ
      this.cnpj = this.empresa.cnpj.toString().replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      const responseArea = await api.get(`/find-area/${this.empresa.idArea}`);
      this.area = responseArea.data;
    } catch (error) {
      console.error('Erro ao carregar a empresa:', error);
      this.showToast('Erro ao carregar a empresa', 'danger');
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
