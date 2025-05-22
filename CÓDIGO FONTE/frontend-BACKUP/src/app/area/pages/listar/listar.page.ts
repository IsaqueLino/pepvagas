import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { AxiosError } from 'axios';
import { api } from 'src/app/services/axios';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  areas: any[] = [];
  originalAreas: any[] = [];
  termoPesquisa: string = '';

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.ionViewDidEnter();
  }

  carregarLista(){
    api.get('/list-areas')
      .then(response => {
        this.areas = response.data;
        this.originalAreas = [...this.areas];
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  adicionarNovaArea(){
    this.navCtrl.navigateForward('/cadastro-area');
  }

  navegarParaAlterar(idArea:number){
    this.navCtrl.navigateForward('/alterar-area', {
      queryParams: {
        "idArea": idArea
      }
    });
  }

  async deletarArea(idArea: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir esta Área?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Exclusão cancelada');
          },
        },
        {
          text: 'Excluir',
          handler: () => {
            api.delete(`/delete-area/${idArea}`)
              .then(response => {
                this.areas = this.areas.filter(area => area.idArea !== idArea);
                this.showToast('Área excluída.','success');
                this.carregarLista();
              })
              .catch(error => {
                if (error.response.status === 422) {
                  this.showToast('Não é possível deletar a área. Ainda há vagas associadas a ela','danger');
                }else if (error.response.status === 423) {
                  this.showToast('Não é possível deletar a área. Ainda há empresas associadas a ela','danger');
                }else{
                  console.error('Erro ao excluir a área:', error);
                  this.showToast(`Erro ao excluir a área: ${error}`,'danger');
                }
              });
          },
        },
      ],
    });
  
    await alert.present();
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
    this.carregarLista();
  }

  filtrarAreasPorNome() {
    const termoPesquisa = this.termoPesquisa.toLowerCase().trim();
    if (!termoPesquisa) {
      this.areas = [...this.originalAreas]; // Restaura as vagas originais
      return;
    }
    this.areas = this.originalAreas.filter(area =>
      area.nome.toLowerCase().includes(termoPesquisa)
    );
  }


}
