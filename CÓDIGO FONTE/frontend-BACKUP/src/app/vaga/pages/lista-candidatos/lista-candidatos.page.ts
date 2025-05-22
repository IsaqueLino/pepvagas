import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { MaskService } from 'src/app/services/mask.service';

@Component({
  selector: 'app-lista-candidatos',
  templateUrl: './lista-candidatos.page.html',
  styleUrls: ['./lista-candidatos.page.scss'],
})
export class ListaCandidatosPage implements OnInit {
  idVaga: number = 0;
  vaga: any = {};
  area: any = {};
  userType: any;
  termoPesquisa: string = '';
  originalCandidatos: any[] = [];


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
      console.log(this.vaga)
      this.originalCandidatos = this.vaga.candidatos; // Salvar os candidatos originais
      const responseArea = await api.get(`/find-area/${this.vaga.idArea}`);
      this.area = responseArea.data;
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

  formatarCEP(cep: number): string {
    const cepString = cep.toString();
    return cepString.substring(0, 5) + '-' + cepString.substring(5);
  }

  filtrarPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.vaga.candidatos = [...this.originalCandidatos]; // Restaura os candidatos originais
      return;
    }
    this.vaga.candidatos = this.originalCandidatos.filter(candidato =>
      candidato.nome.toLowerCase().includes(termoPesquisa)
    );
  }
  
}