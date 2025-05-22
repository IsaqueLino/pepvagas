import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { api } from '../services/axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('popover') popover: any;

  userType: string = '';
  userName: string = '';
  isOpen: boolean = false;

  vagas: any[] = [];
  termoPesquisa: string = '';
  originalVagas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService,
  ) {
  }


  ngOnInit() {
    this.userType = this.authService.getUserType();
    this.userName = this.authService.getUserName();
    this.ionViewDidEnter();
  }

  navegarParaLogin($event: MouseEvent) {
    this.popover.dismiss();
    this.navCtrl.navigateForward('login');
  }

  async navegarParaCadastro($event: MouseEvent) {
    this.navCtrl.navigateForward('cadastro-geral');
    this.popover.dismiss();
  }

  navegarParaServicos($event: MouseEvent) {
    this.navCtrl.navigateForward('listar-servicos');
    this.popover.dismiss();
  }

  carregarTodasVagasCandidato() {
      api.get('/list-vagas-candidato')
        .then(response => {
          this.vagas = response.data;
          this.originalVagas = [...this.vagas];
        })
        .catch(error => {
          console.error('Erro:', error);
        });
  }

  navegarParaVisualizar(idVaga: number) {
    this.navCtrl.navigateForward('/visualizar-vaga', {
      queryParams: {
        "idVaga": idVaga
      }
    });
  }


  formatarData(data: string): string {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const hora = String(dataObj.getHours()).padStart(2, '0');
    const minuto = String(dataObj.getMinutes()).padStart(2, '0');
    const segundo = String(dataObj.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${hora}:${minuto}:${segundo}`;
  }

  formatarDataLimite(data: string): string {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  filtrarVagasPorTitulo() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.vagas = [...this.originalVagas]; // Restaura as vagas originais
      return;
    }
    this.vagas = this.originalVagas.filter(vaga =>
      vaga.titulo_vaga.toLowerCase().includes(termoPesquisa)
    );
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

  ionViewDidEnter() {
    this.carregarTodasVagasCandidato();
  }


}
