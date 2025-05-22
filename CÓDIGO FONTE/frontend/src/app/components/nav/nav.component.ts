import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { AdministradorService } from 'src/app/services/administrador.service';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatoService } from 'src/app/services/candidato.service';
import { VagaService } from 'src/app/services/vaga.service';
import { RepresentanteService } from 'src/app/services/representante.service';
import { MembroService } from 'src/app/services/membro.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProfissionalLiberalService } from 'src/app/services/profissional-liberal.service';





@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {

  @ViewChild('popover') popover: any;

  public isLogged: boolean = false
  public isDarkTheme: boolean = false
  public userType: string = ''
  public isPopoverOpen = false
  public userName: string = ''

  constructor(
    private candidatoService: CandidatoService,
    private authService: AuthService,
    private vagaService: VagaService,
    private adminService: AdministradorService,
    private representanteService: RepresentanteService,
    private membroService: MembroService,
    private empresaService: EmpresaService,
    private profissionalLiberalService: ProfissionalLiberalService,
    private navController: NavController,
    private popoverController: PopoverController
  ) {
    this.userType = this.authService.getType() ?? ''

    if (this.authService.getJwt()) {
      this.isLogged = true
      this.loadUserName();
    } else {
      this.isLogged = false
    }
    
    this.userType = this.authService.getType() ?? ''
  }

  async ngOnInit() {

    this.checkTheme();
    this.handleTheme();

    if (this.authService.getJwt()) {
      this.isLogged = true
      await this.loadUserName();
    }

    this.userType = this.authService.getType() ?? ''
  }

  async loadUserName() {
    try {
      const userId = this.authService.getUser();
      const userType = this.authService.getType();
      
      if (!userId || !userType) {
        this.userName = 'Usuário';
        return;
      }
  
      switch(userType) {
        case 'C': // Candidato
          const candidato = await this.candidatoService.getCandidato(userId);
          this.userName = candidato.nome?.split(' ')[0] || 'Candidato';
          break;
          
        case 'E': // Empresa
          const empresa = await this.empresaService.getEmpresa(userId);
          this.userName = empresa.nomeEmpresa?.split(' ')[0] || empresa.nomeFantasia?.split(' ')[0] || 'Empresa';
          break;
          
        case 'A': // Administrador
          const admin = await this.adminService.getAdministrador(userId);
          this.userName = admin.nome?.split(' ')[0] || 'Administrador';
          break;
          
        case 'M': // Membro da Equipe
          const membro = await this.membroService.getMembroEquipe(userId);
          this.userName = membro.nome?.split(' ')[0] || 'Membro';
          break;
          
        case 'L': // Profissional Liberal
          const profissional = await this.profissionalLiberalService.getProfissionalLiberal(userId);
          this.userName = profissional.nome?.split(' ')[0] || 'Profissional';
          break;
          
        case 'R': // Representante
          const representante = await this.representanteService.getRepresentante(userId);
          this.userName = representante.nome?.split(' ')[0] || 'Representante';
          break;
          
        default:
          this.userName = 'Usuário';
      }
    } catch (error) {
      console.error('Erro ao carregar nome do usuário:', error);
      this.userName = 'Usuário';
    }
  }

  goToLogin(){
    this.navController.navigateRoot('/login')
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.handleTheme();
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme');
    this.isDarkTheme = theme === 'dark';
  }

  private handleTheme() {
    const theme = this.isDarkTheme ? 'dark' : 'light';
    document.body.setAttribute('color-scheme', theme);
    localStorage.setItem('theme', theme);
  }

  logout() {
    this.popoverController.dismiss()
    this.authService.logout()
    this.navController.navigateRoot('login')
  }

  public presentPopover(e: Event) {
    this.popover.event = e;
    this.isPopoverOpen = true;
  }

  public redirect() {
    switch (this.userType) {
      case 'E':
        this.popoverController.dismiss()
        this.navController.navigateRoot("empresa-perfil")
        break;
      case 'C':
        this.popoverController.dismiss()
        this.navController.navigateRoot("candidato-perfil")
        break;
      case 'M':
        this.popoverController.dismiss()
        this.navController.navigateRoot("equipe-perfil")
        break;
      case 'L':
        this.popoverController.dismiss()
        this.navController.navigateRoot("perfil-profissional-liberal")
        break;
      case 'R':
        this.popoverController.dismiss()
        this.navController.navigateRoot("representante-perfil")
        break;
      case 'A':
        this.popoverController.dismiss()
        this.navController.navigateRoot("administrador-perfil")
        break;
      default:
        break;
    }
  }

  public goTo(route: string){
    this.popoverController.dismiss()

    if(route == 'home' && this.userType == "E")
      this.navController.navigateRoot('minhas-vagas')
    else
      this.navController.navigateRoot(route)
  }

}
