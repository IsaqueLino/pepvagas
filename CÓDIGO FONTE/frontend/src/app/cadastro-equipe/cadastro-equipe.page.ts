import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../../../../shared/enums/TipoUsuario'
import { MembroService } from '../services/membro.service'
import { AdministradorService } from '../services/administrador.service';
import { CandidatoService } from '../services/candidato.service';

@Component({
  selector: 'app-cadastro-equipe',
  templateUrl: './cadastro-equipe.page.html',
  styleUrls: ['./cadastro-equipe.page.scss'],
})
export class CadastroEquipePage implements OnInit {

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController,
    private equipeService: MembroService,
    private candidatoService: CandidatoService,
    private adminService: AdministradorService
  ) { 
    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')
  }

  public isDarkTheme: boolean = false
  public isLogged: boolean = false
  public novaEquipe: {nome: string} = {nome: ''}
  public novaConta: {email: string, senha: string, confirmarSenha: string} = {email: '', senha: '', confirmarSenha: ''}
  public user: any = {}
  public userType: string = ''
  public emailInvalid: boolean = false;

  ngOnInit() {
    this.checkTheme()
    this.getUser()
    
    if (this.authService.getJwt()){
      this.isLogged = true
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = this.novaConta.email ? !emailRegex.test(this.novaConta.email) : false;
  }

  async onSubmit(){

    this.validateEmail();
    
    if (this.emailInvalid) {
      this.exibirMensagem("Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).");
      return;
    }

    if (this.novaEquipe.nome.length == 0) {
      this.exibirMensagem("Informe o nome do membro da equipe.")
    }
    else if (this.novaConta.email.length == 0) {
      this.exibirMensagem("Informe o e-mail da conta.")
    }
    else if(this.novaConta.senha.length < 4){
      this.exibirMensagem("A senha deve ter no mímino 4 caracteres.")
    }
    else if (this.novaConta.senha != this.novaConta.confirmarSenha) {
      this.exibirMensagem("As senhas não coincidem.")
    }else{
      try {
        const response = await this.authService.createAccount(this.novaConta.email, this.novaConta.senha, TipoUsuario.MEMBRO_EQUIPE)

        if(response.status == 201){
          const response2 = await this.equipeService.cadastrarMembroEquipe(response.data.idConta, this.novaEquipe.nome)

        if(response2.status == 201){
          this.exibirMensagem("Membro da Equipe " + this.novaEquipe.nome + " cadastrado com sucesso!")
          this.novaEquipe.nome = ''
          this.novaConta.email = ''
          this.novaConta.senha = ''
          this.novaConta.confirmarSenha = ''
        } else if (response2.status == 409) {
          this.exibirMensagem("Erro interno no servidor")
          console.error("Erro ao criar conta")
        }

        } else if (response.status == 409) {
          const msg = response.response?.data?.message || "Erro ao criar a conta";
          this.exibirMensagem(msg);
        }

      } catch (error) {
        console.error("Erro ao cadastrar Membro da Equipe")
        this.exibirMensagem("Erro interno no servidor")
      }
    }
  }

  cancelar(){
    this.navController.navigateForward('home')
  }

  async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  toggleTheme() {
    if (this.isDarkTheme)
      this.isDarkTheme = false
    else
      this.isDarkTheme = true

    this.handleTheme()
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

  logout() {
    this.authService.logout()
    this.navController.navigateForward('login')
  }

  async getUser() {
    const userId = this.authService.getUser();
    const userType = this.authService.getType();
  
    if (userId == null) {
      this.isLogged = false;
    } else {
      this.userType = userType ?? '';
  
      switch (userType) {
        case "A":
          const admin = await this.adminService.getAdministrador(userId);
          if (admin) {
            this.user = admin;
          } else {
            console.error("Erro ao buscar administrador.");
          }
          break;
        case "C":
          this.user = await this.candidatoService.getCandidato(userId);
          break;
        case "E":
          break;
        case "M":
          this.user = await this.equipeService.getMembroEquipe(userId);
          break;
        case "R":
          break;
        case "L":
          break;
      }
  
      this.isLogged = true;
    }
  }  

}
