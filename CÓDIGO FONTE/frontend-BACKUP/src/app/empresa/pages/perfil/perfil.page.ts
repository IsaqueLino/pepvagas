import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AlertController, NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import { EmpresaData } from '../../empresaData';
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
  empresa: any;
  
  empresaData = {
    nomeEmpresa: '',
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
      this.id = params['id'];
      this.userType = localStorage.getItem('userType');

      if (this.userType == TipoUsuario.EMPRESA) {
        this.id = localStorage.getItem('userId');
      } else {
        this.navCtrl.back();
      }
      if (this.id == null || this.id == 0) {
        this.id = localStorage.getItem('userId');
      }
      this.carregarEmpresaPorId(this.id);
      console.log(this.id);
    });

  }


  async carregarEmpresaPorId(idEmpresa: number) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.token}`
      };

      const response = await api.get(`/find-empresa/${idEmpresa}`, { headers });

      if (response.status === 200) {
        this.empresa = response.data;
        this.empresaData.nomeEmpresa = this.empresa.nomeEmpresa;
        this.empresaData.email = this.empresa.email;        
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
    this.navCtrl.navigateForward(['/alterar-empresa'], {
      queryParams: {
        idEmpresa: this.id
      }
    });
  }

  async setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    if (ev.detail.role === 'confirm') {
      await this.deleteSelf(this.id);
    }
  }

  async deleteSelf(idEmpresa: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem realmente certeza de que deseja desativar esta empresa?',
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
            api.delete(`/delete-empresa/${idEmpresa}`)
              .then(response => {
                this.showToast('Empresa desativada', 'success');
                this.navCtrl.navigateRoot(['/login']);
              })
              .catch(error => {
                if (error.response.status === 400) {
                  this.showToast('Não é possível desativar a empresa, ela ainda possui representantes ativos', 'danger');
                } else if (error.response.status === 401) {
                  this.showToast('Não é possível desativar a empresa, ela ainda possui vagas ativas', 'danger');
                } else {
                  console.error('Erro ao desativar empresa:', error);
                  this.showToast(`Erro ao desativar empresa: ${error}`, 'danger');
                }
              });
          },
        },
      ],
    });

    await alert.present();
  }


  
}
