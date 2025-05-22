import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { EmpresaService } from '../services/empresa.service';
import { RepresentanteService } from '../services/representante.service';
import { AuthService } from '../services/auth.service';
import { CandidatoService } from '../services/candidato.service';
import { AdministradorService } from '../services/administrador.service';
import { TipoUsuario } from '../../../../shared/enums/TipoUsuario';

@Component({
  selector: 'app-cadastro-representante',
  templateUrl: './cadastro-representante.page.html',
  styleUrls: ['./cadastro-representante.page.scss'],
})
export class CadastroRepresentantePage implements OnInit {

  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  public isDarkTheme: boolean = false
  public novoRepresentante: {nome: string, empresa: string} = {nome: '', empresa: ''}
  public novaConta: {email: string, senha: string, confirmarSenha: string} = {email: '', senha: '', confirmarSenha: ''}
  private userId: any

  constructor(private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController,
    private representanteService: RepresentanteService,
    private candidatoService: CandidatoService,
    private adminService: AdministradorService,
    private empresaService: EmpresaService
  ) { 
    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')
  }

  async ngOnInit() {
    this.getUser()
    this.novoRepresentante.empresa = this.userId
  }

  async onSubmit(){
    if (this.novoRepresentante.nome.length == 0) {
      this.exibirMensagem("Informe o nome do membro da equipe")
    }
    else if (this.novaConta.email.length == 0) {
      this.exibirMensagem("Informe o e-mail da conta")
    }
    else if(this.novaConta.senha.length < 4){
      this.exibirMensagem("A senha deve ter no mímino 4 caracteres")
    }
    else if (this.novaConta.senha != this.novaConta.confirmarSenha) {
      this.exibirMensagem("As senhas não colidem")
    }else{
      try {
        const response = await this.authService.createAccount(this.novaConta.email, this.novaConta.senha, TipoUsuario.REPRESENTANTE)

        if(response.status == 201){
          const response2 = await this.representanteService.cadastrarRepresentante(response.data.idConta, this.novoRepresentante.nome, this.novoRepresentante.empresa)

          if(response2.status == 201){
            this.exibirMensagem("Representante " + this.novoRepresentante.nome + " cadastrado com sucesso!")
            this.novoRepresentante.nome = ''
            this.novoRepresentante.empresa = ''
            this.novaConta.email = ''
            this.novaConta.senha = ''
            this.novaConta.confirmarSenha = ''
            this.ngOnInit()
          } else{
            this.exibirMensagem("Erro interno no servidor")
            console.error("Erro ao criar conta")
          }
        } else{
          console.log("Erro ao criar conta.")
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  cancelar(){
    this.navController.navigateForward('empresa-representantes')
  }

  async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  logout() {
    this.authService.logout()
    this.navController.navigateForward('login')
  }

  async getUser() {
    this.userId = this.authService.getUser()
    const userType = this.authService.getType()
    if (this.userId == null) {
      this.isLogged = false
    } else {

      this.userType = userType ?? ''
      switch (userType) {
        case "A":
          this.user = await this.adminService.getAdministrador(this.userId)
          console.log(this.user)
          break;
        case "C":
          this.user = await this.candidatoService.getCandidato(this.userId)
          break;
        case "E":
          this.user = await this.empresaService.getEmpresa(this.userId)
          break;
        case "M":
          break;
        case "R":
          break;
        case "L":
          break;
      }


      // const user = await this.candidatoService.getCandidato(userId)
      // this.user = user
      this.isLogged = true
    }
  }

}
