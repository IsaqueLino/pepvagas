import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import { EquipeData } from '../../equipeData';
import {Modalidade} from "../../../../../../shared/enums/Modalidade";
import {TipoVaga} from "../../../../../../shared/enums/TipoVaga";
import {Regime} from "../../../../../../shared/enums/Regime";
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
  equipment: any;
  
  equipeData = {
    nome: '',
    email: '',
    senha: '',
    tipo: '',
  };
  

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
  ) {
  }

  ngOnInit() {
    this.id = localStorage.getItem('userId');
    this.userType = localStorage.getItem('userType');
    this.carregarEquipePorId(this.id);

  }


  async carregarEquipePorId(idEquipe: number) {
    try {
      
      const headers = {
        'Authorization': `Bearer ${this.token}`
      };

      const response = await api.get(`/find-equipe/${idEquipe}`, { headers });

      if (response.status === 200) {
        this.equipment = response.data;
        this.equipeData.nome = this.equipment.nome;
        this.equipeData.email = this.equipment.email;
        this.equipeData.senha = '********';    
      }
    } catch (error) {
      if(error instanceof AxiosError) {
        if(error.response?.status === 401) {
          this.showToast(error.response?.data.message, 'danger');
          return;
        } else {
          this.showToast(error.response?.data.message, 'danger');
          return;
        }
      }
      console.error('Erro ao carregar:', error);
      this.showToast('Erro ao carregar', 'danger');

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
    this.navCtrl.navigateRoot(['/perfil-equipe-alterar'], {
      queryParams: {
        id: this.id
      }
    });
  }


  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    if (ev.detail.role === 'confirm') {
      this.deleteSelf();
    }
  }

  deleteSelf() {
    console.log('deleteSelf');
    const token = localStorage.getItem('token');

    if (!token) {
      this.showToast('Você precisa estar logado para realizar esta ação!', 'danger');
      return;
    }

    const id = this.id;

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return api.delete(`/delete-admin/${id}`, {headers})
      .then((response) => {
        if (response.status === 200) {
          this.showToast('Membro de equipe desativado com sucesso!', 'success');
          this.navCtrl.navigateRoot(['/login']);
        }
        localStorage.removeItem('token');
      })


  }

  protected readonly TipoUsuario = TipoUsuario;

}
