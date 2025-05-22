import { Component } from '@angular/core';
import { CandidatoService } from '../services/candidato.service';
import { AuthService } from '../services/auth.service';
import { VagaService } from '../services/vaga.service';
import { AdministradorService } from '../services/administrador.service';
import { NavController } from '@ionic/angular';
import { EmpresaService } from '../services/empresa.service';
import { RepresentanteService } from '../services/representante.service';
import { MembroService } from '../services/membro.service';
import { ProfissionalLiberalService } from '../services/profissional-liberal.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private vagas: any = []
  public listaVagas: any = [...this.vagas]
  public vagasRelacionadas: any = []
  public isDarkTheme: boolean = false
  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false

  public isToastOpen = false

  public toastButtons = [
    {
      text: 'Perfil',
      role: 'info',
      handler: () => {
        this.navController.navigateRoot('candidato-perfil')
      },
    },
    {
      text: 'X',
      role: 'cancel',
    },
  ];

  constructor(
    private candidatoService: CandidatoService,
    private authService: AuthService,
    private vagaService: VagaService,
    private adminService: AdministradorService,
    private navController: NavController,
    private empresaService: EmpresaService,
    private representanteService: RepresentanteService,
    private equipeService: MembroService,
    private profissionalLiberalService: ProfissionalLiberalService
  ) {

    setTimeout(() => {
      this.getVagas()
    }, 500)

    this.getUser()
    sessionStorage.clear()
  }

  ngOnInit() {
    setTimeout(() => {
      this.getVagas()
    }, 500)

    this.checkTheme()
    this.getUser()

    if (this.authService.getJwt()) {
      this.isLogged = true
    }

    if (this.userType == 'C') {
      this.checkInteressesCandidato()
    } else if (this.userType == 'E'){
      this.navController.navigateRoot("/minhas-vagas")
    }

    sessionStorage.clear()
  }

  async ionViewWillEnter() {
    this.ngOnInit()
  }

  async checkInteressesCandidato() {

    const disponibilidade = this.user.disponibilidade
    const cidade = this.user.cidade
    const vaga = this.user.tipoVaga
    const areas = this.user.areas
    const instrucao = this.user.nivelInstrucao
    const cnh = this.user.cnh
    const pretensaoSalarial = this.user.pretensaoSalarial

    if (!disponibilidade || !cidade || !vaga || areas.length == 0 || !instrucao || !cnh || !pretensaoSalarial) {
      this.isToastOpen = true
    }else{
      this.isToastOpen = false
    }

  }

  async getUser() {
    const userId = this.authService.getUser()
    const userType = this.authService.getType()
    if (userId == null) {
      this.isLogged = false
    } else {

      this.userType = userType ?? ''
      switch (userType) {
        case "A":
          this.user = await this.adminService.getAdministrador(userId)
          break;
        case "C":
          this.user = await this.candidatoService.getCandidato(userId)
          break;
        case "E":
          this.user = await this.empresaService.getEmpresa(userId)
          break;
        case "M":
          this.user = await this.equipeService.getMembroEquipe(userId)
          break;
        case "R":
          this.user = await this.representanteService.getRepresentante(userId)
          break;
        case "L":
          this.user = await this.profissionalLiberalService.buscarProfissional(userId)
          break;
      }

      // const user = await this.candidatoService.getCandidato(userId)
      // this.user = user
      this.isLogged = true
    }
  }

  async getVagas() {
    const response = await this.vagaService.getVagas()
    this.vagas = response.data
    this.listaVagas = [...this.vagas]

    this.matchVagas()

    this.sortVagas()
  }

  // SISTEMA DE PONTUACAO
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
  }

  toggleTheme() {
    if (this.isDarkTheme)
      this.isDarkTheme = false
    else
      this.isDarkTheme = true

    this.handleTheme()
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
      this.isDarkTheme = true
    } else {
      document.body.setAttribute('color-scheme', 'light')
      this.isDarkTheme = false
    }
  }

  private handleTheme() {
    if (this.isDarkTheme) {
      document.body.setAttribute('color-scheme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  logout() {
    this.authService.logout()
    this.navController.navigateRoot('login')
  }

  verVagaDetalhes(idVaga: string) {
    localStorage.setItem('idVaga', idVaga);
  }


}
