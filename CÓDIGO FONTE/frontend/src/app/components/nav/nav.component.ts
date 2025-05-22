import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { AdministradorService } from 'src/app/services/administrador.service';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatoService } from 'src/app/services/candidato.service';
import { VagaService } from 'src/app/services/vaga.service';

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

  constructor(
    private candidatoService: CandidatoService,
    private authService: AuthService,
    private vagaService: VagaService,
    private adminService: AdministradorService,
    private navController: NavController,
    private popoverController: PopoverController
  ) {
    this.userType = this.authService.getType() ?? ''

    if (this.authService.getJwt()) {
      this.isLogged = true
    } else {
      this.isLogged = false
    }
    
    this.userType = this.authService.getType() ?? ''
  }

  ngOnInit() {

    this.checkTheme()

    if (this.authService.getJwt()) {
      this.isLogged = true
    }

    this.userType = this.authService.getType() ?? ''
  }

  goToLogin(){
    this.navController.navigateRoot('/login')
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
