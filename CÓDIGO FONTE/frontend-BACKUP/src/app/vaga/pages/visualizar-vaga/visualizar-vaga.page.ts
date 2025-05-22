import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { MaskService } from 'src/app/services/mask.service';
import {AxiosError} from "axios";

@Component({
  selector: 'app-visualizar-vaga',
  templateUrl: './visualizar-vaga.page.html',
  styleUrls: ['./visualizar-vaga.page.scss'],
})
export class VisualizarVagaPage implements OnInit {
  idVaga: number = 0;
  vaga: any = {};
  area: any = {};
  userType: any;

  empresa: any = {};
  cep: any
  cnpj: any
  pcd: any
  regime: any

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    public maskService: MaskService,
    private navCtrl: NavController,
  ) {
    this.userType = localStorage.getItem('userType');
  }

  ngOnInit(): void {
    this.ionViewDidEnter();
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.idVaga = params['idVaga'];
      this.carregarVagaPorId(this.idVaga);
    });
  }

  async carregarVagaPorId(idVaga: number) {
    try {
      const responseVaga = await api.get(`/find-vaga/${idVaga}`);
      this.vaga = responseVaga.data;

      if(this.vaga.pcd === 0){
        this.pcd = "Não";
      }else{
        this.pcd = "Sim";
      }

      if(this.vaga.regime!=''){
        this.regime = this.vaga.regime;
      }else{
        this.regime = 'Nenhum';
      }

      this.cep = this.vaga.cep.toString().replace(/^(\d{5})(\d{3})$/, '$1-$2');
      const responseArea = await api.get(`/find-area/${this.vaga.idArea}`);
      this.area = responseArea.data;
      if(this.vaga.idEmpresa){
        const responseEmpresa = await api.get(`/find-empresa/${this.vaga.idEmpresa}`);
        this.empresa = responseEmpresa.data;
        console.log(this.empresa);
      }
    } catch (error) {
      console.error('Erro ao carregar a vaga:', error);
      this.showToast('Erro ao carregar a vaga', 'danger');
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

  async Candidatar(id_vaga: any) {
    const userId = localStorage.getItem('userId');
    const body = {
      idVaga: id_vaga,
      idCandidato: userId
    }

    try {
      const response = await api.post('/canditar-vaga',  body);

      this.showToast('Candidatura realizada com sucesso!', 'success');
      this.navCtrl.navigateRoot('/listar-vaga');

    }catch (error) {
      if( error instanceof AxiosError) {

        console.error('Erro ao carregar a vaga:', error);
        if (error.response){
          this.showToast(error.response.data.message, 'danger');
        }else{
          this.showToast(error.message, 'danger');
        }

      }else{
        console.error('Erro ao carregar a vaga:', error);
        this.showToast('Erro ao carregar a vaga', 'danger');
      }

    }
  }

  navegarParaListarCandidatos(idVaga: number) {
    this.navCtrl.navigateForward('/lista-candidatos', {
      queryParams: {
        "idVaga": idVaga
      }
    });
  }

  formatarCEP(cep: number): string {
    const cepString = cep.toString();
    return cepString.substring(0, 5) + '-' + cepString.substring(5);
  }

  async buscarNomeEmpresa(idEmpresa: number) {
    const responseEmpresa = await api.get(`/find-empresa/${idEmpresa}`);
    this.empresa = responseEmpresa.data;  
    return this.empresa.nomeEmpresa;
  }
}
