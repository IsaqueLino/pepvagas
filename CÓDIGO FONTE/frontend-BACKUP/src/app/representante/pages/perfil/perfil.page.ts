import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AlertController, NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import { RepresentanteData } from '../../representanteData';
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";
import { AxiosError } from 'axios';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  id: any = 0;
  token = localStorage.getItem('token');
  userType: any = undefined;
  userName: any = undefined;
  representante: any;
  
  representanteData = {
    nome: '',
    email: '',
    senha: '',
    tipo: '',
  };
  
  protected readonly TipoUsuario = TipoUsuario;
  
  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'Sim',
      role: 'confirm',
      handler: () => {
      },
    },
  ];


  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      console.log(params['id'])
      this.id = params['id'];
      this.userType = localStorage.getItem('userType');

      if (this.userType == TipoUsuario.REPRESENTANTE) {
        this.id = localStorage.getItem('userId');
      } else {
        this.navCtrl.back();
      }
      if (this.id == null || this.id == 0) {
        this.id = localStorage.getItem('userId');
      }
      this.carregarRepresentantePorId(this.id);

    });

  }


  async carregarRepresentantePorId(idRepresentante: number) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.token}`
      };

      const response = await api.get(`/find-representante/${idRepresentante}`, { headers });

      if (response.status === 200) {
        this.representante = response.data;
        this.representanteData.nome = this.representante.nome;
        this.representanteData.email = this.representante.email;        
      }
    } catch (error) {
      if(error instanceof AxiosError) {
        {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
      }
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

  async toEditar() {
    this.navCtrl.navigateForward(['/alterar-representante'], {
      queryParams: {
        idRepresentante: this.id
      }
    });
  }

  
  async setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    if (ev.detail.role === 'confirm') {
      await this.deleteSelf(this.id);
    }
  }

  /*
  deleteSelf() {
    const id = this.id;
    return api.delete(`/delete-representante/${id}`)
      .then((response) => {
        if (response.status === 200) {
          this.showToast('Representante desativada com sucesso!', 'success');
          this.navCtrl.navigateRoot(['/login']);
        }
        localStorage.removeItem('token');
      })
  }*/

  async deleteSelf(idRepresentante: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem realmente certeza de que deseja desativar este Representante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Ação cancelada');
          },
        },
        {
          text: 'Desativar',
          handler: () => {
            api.delete(`/delete-representante/${idRepresentante}`)
              .then(response => {
                this.showToast('Representante desativado.', 'success');
                this.navCtrl.navigateRoot(['/login']);
              })
              .catch(error => {
                if (error.response.status === 400) {
                  this.showToast('Não é possível desativar o representante, pois há vagas vinculadas à ele', 'danger');
                } else {
                  console.error('Erro ao desativar representante:', error);
                  this.showToast(`Erro ao desativar representante: ${error}`, 'danger');
                }
              });
          },
        },
      ],
    });

    await alert.present();
  }


  
}
