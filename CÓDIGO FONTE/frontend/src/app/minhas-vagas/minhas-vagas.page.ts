import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { VagaService } from '../services/vaga.service';
import { CandidatoService } from '../services/candidato.service';
import { AdministradorService } from '../services/administrador.service';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { EmpresaService } from '../services/empresa.service';
import { AxiosResponse } from 'axios';

@Component({
  selector: 'app-minhas-vagas',
  templateUrl: './minhas-vagas.page.html',
  styleUrls: ['./minhas-vagas.page.scss'],
})
export class MinhasVagasPage implements OnInit {

  @ViewChild('popoverVaga') popoverVaga: any;

  private vagas: any = []
  public listaVagas: any = [...this.vagas]
  public vagasRelacionadas: any = []
  public user: any = {}
  public userType: any = {}
  public isPopoverVagaOpen: boolean = false

  constructor(
    private candidatoService: CandidatoService,
    private authService: AuthService,
    private vagaService: VagaService,
    private adminService: AdministradorService,
    private navController: NavController,
    private empresaService: EmpresaService,
    private toastController: ToastController,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {
    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')
   }

  ngOnInit(
    
  ) {
    this.getUser()
    
    setTimeout(() => {
      this.getVagas()
    }, 700)
  }

  async getVagas() {
    const response = await this.vagaService.getVagasPorConta( this.user.idconta ?? this.user.data.idconta)
    this.vagas = response.data
    this.listaVagas = [...this.vagas]

    this.matchVagas()

    this.sortVagas()
  }

  matchVagas() {
    this.listaVagas.filter((vaga: any) => {

      let point = 0

      if (this.user.pcd != null && vaga.pcd == this.user.pcd)
        point++

      if (this.user.pretensaoSalarial != null && vaga.salario >= this.user.pretensaoSalarial)
        point++

      if (this.user.tipoVaga != null && vaga.regime.toLowerCase() == this.user.tipoVaga.toLowerCase())
        point = point + 2

      if (this.user.areas) {
        this.user.areas.forEach((area: any) => {
          if (area.idArea == vaga.idArea.idArea) {
            point = point + 2
          }
        });
      }

      vaga.matchPoint = point

    })
  }
  
  async confirmarExclusao(){
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza que deseja excluir a vaga?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.isPopoverVagaOpen = false;
          },
        },
        {
          text: 'Excluir',
          handler: () => {
            this.isPopoverVagaOpen = false;
            this.removerVaga()
          },
        },
      ],
    });

    await alert.present();
  }

  sortVagas() {
    this.listaVagas.sort((a: any, b: any) => {
      if (a.matchPoint <= b.matchPoint) {
        return 1
      } else {
        return -1
      }
    })
  }

  handleFilter(event: any) {
    const query = event.target.value.toLowerCase();

    if (query == '') {
      this.listaVagas = [...this.vagas]
      return this.listaVagas
    }

    this.listaVagas = this.listaVagas.filter((vaga: any) => {
      if (vaga.titulo.toLowerCase().indexOf(query) > -1) {
        return vaga
      }
    })

    console.log(this.listaVagas)
  }

  async getUser() {
    const userId = this.authService.getUser()
    const userType = this.authService.getType()
    if (userId == null) {
     
    } else {

      this.userType = userType ?? ''

      console.log("Tipo usuário " + this.userType)
      switch (userType) {
        case "A":
          this.user = await this.adminService.getAdministrador(userId)
          console.log("DADOS DO ADMIN " + this.user)
          break;
        case "C":
          this.user = await this.candidatoService.getCandidato(userId)
          break;
        case "E":
          this.user = await this.empresaService.getEmpresa(userId)
          break;
        case "M":
          break;
        case "R":
          break;
        case "L":
          break;
      }
    }
  }

  
  

  public presentPopoverVaga(e: Event, idVaga: string) {
    this.popoverVaga.event = e;
    this.isPopoverVagaOpen = true;
    localStorage.setItem('idVaga', idVaga);
  }

  verDetalhesVaga() {
    this.popoverController.dismiss()
    this.navController.navigateForward('/vaga-detalhes');
  }

  public editarVaga(){
    this.popoverController.dismiss()
    this.navController.navigateRoot('/editar-vaga')
  }

  public async removerVaga(){
    const jwt = this.authService.getJwt() ?? ''
    const idVaga = localStorage.getItem('idVaga') ?? ''

    const response: AxiosResponse = await this.vagaService.delete(idVaga, jwt)

    if(response.status == 200){
      this.showMessage(response.data.message, 'success')
      this.getVagas()
    }

    this.popoverController.dismiss()
  }

  async showMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color
    })

    toast.present()
  }


}
