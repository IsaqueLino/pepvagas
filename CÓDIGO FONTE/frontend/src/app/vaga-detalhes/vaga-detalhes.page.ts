import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { CandidatoService } from '../services/candidato.service';
import { VagaService } from '../services/vaga.service';
import { AdministradorService } from '../services/administrador.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { EmpresaService } from '../services/empresa.service';
import { RepresentanteService } from '../services/representante.service';
import { MembroService } from '../services/membro.service';
import { ProfissionalLiberalService } from '../services/profissional-liberal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vaga-detalhes',
  templateUrl: './vaga-detalhes.page.html',
  styleUrls: ['./vaga-detalhes.page.scss'],
})
export class VagaDetalhesPage implements OnInit {

  public login: any = {}
  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  public vaga: any;
  public candidato: any;
  private id: string = '';
  public isCandidato: boolean = false;
  public isVisible: boolean = false;
  public dataExpira: any;
  public salario: any;
  public linkSite: any = null;
  public temSite: boolean = false;
  public selectedFile: File | null = null;
  public selectedOption: any = '';
  public isEnvironment: boolean = false;

  constructor(
    private authService: AuthService,
    private navigationController: NavController,
    private toastController: ToastController,
    private candidatoService: CandidatoService,
    private vagaService: VagaService,
    private adminService: AdministradorService,
    private empresaService: EmpresaService,
    private representanteService: RepresentanteService,
    private equipeService: MembroService,
    private profissionalLiberalService: ProfissionalLiberalService
  ) {
  }

  async ngOnInit() {
    this.checkTheme()

    await this.getUser();

    console.log(this.user)

    if (!this.authService.getJwt())
      this.isLogged = false;
    else {
      this.isLogged = true;
    }

    if(this.userType == "C"){
      try {
        const response = await this.authService.getContaDetails();
        this.candidato = await this.candidatoService.getCandidato(response.idConta)
        console.log("Candidato: " + this.candidato)

      } catch (error) {
        console.error('Erro ao obter detalhes da conta:', error);
      }
    }

    const idVaga = localStorage.getItem('idVaga');
    if (!idVaga) {
      this.showMessage("Erro ao encontrar a vaga",'danger');
      this.navigationController.navigateBack('home');
      return;
    }

    this.id = idVaga;
    this.getVaga(idVaga);


    if(environment.production)
        this.isEnvironment = true

  }

  goToHome(){
    this.navigationController.navigateRoot('home')
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
          this.isCandidato = true;
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


  async enviarEmailComCurriculo(file: File) {
    let resposta;
    if (file)
      resposta = await this.candidatoService.enviarEmailComCurriculo(this.candidato.idconta, this.vaga.idVaga, file);
    if (resposta){
      this.showMessage('Curriculo enviado com sucesso!','success');
      this.navigationController.navigateBack('home');
    }
    else {
      this.showMessage('Erro ao enviar email.','danger');
    }
  }

  async enviarEmailComCurriculoDoPerfil() {
    let resposta;
    resposta = await this.candidatoService.enviarEmailComCurriculoDoPerfil(this.candidato.idconta, this.vaga.idVaga);
    if (resposta){
      this.showMessage('Curriculo enviado com sucesso!','success');
      this.navigationController.navigateBack('home');
    } else {
      this.showMessage('Erro ao enviar email.','danger');
    }
  }

  public candidatar() {
    if (this.isCandidato && this.isLogged) {

      let resposta: any = '';
      if (this.selectedOption === 'novo') {
        if (this.selectedFile) {
          if (this.selectedFile.name.endsWith('.pdf')) {
            if(this.selectedFile.size <= 8*(1024*1024)){
              resposta = this.enviarEmailComCurriculo(this.selectedFile);
            } else {
              this.showMessage('Selecione um arquivo que não seja maior que 8MB para enviar o currículo.','danger');
            }
          } else {
            this.showMessage('Selecione um arquivo PDF para enviar o currículo.','danger');
          }
        } else {
          this.showMessage('Selecione um arquivo para enviar o email.','danger');
        }
      } else if (this.selectedOption === 'perfil') {
        this.getUser()
        console.log(this.candidato)
        if (this.candidato.curriculo) {
          resposta = this.enviarEmailComCurriculoDoPerfil();
          console.log(resposta);
          this.showMessage('Sucesso ao enviar email com a candidatura.','success');
        } else {
          this.showMessage('O candidato não tem curriculo cadastrado.','danger');
        }
      } else if (this.selectedOption === '') {
        this.showMessage('Selecione uma opção para enviar o email.','danger');
      } else {
        this.showMessage('Erro ao enviar email.','danger');
      }
    } else {
      if (!this.isLogged) {
        this.showMessage("Faça login para se candidatar!", 'danger')
        return;
      }

      if (!this.isCandidato) {
        this.showMessage("Seja candidato para se candidatar!", 'danger')
        return
      }
    }

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  async getVaga(id: string) {
    const response = await this.vagaService.getVaga(id);
    this.vaga = response.data;

    this.setarLink();

    this.formatar();

    console.log(this.vaga);
  }

  async setarLink() {
    if (this.vaga.idEmpresa.site) {
      this.temSite = true;
      this.linkSite = this.vaga.idEmpresa.site;
    }
    if (this.temSite && !this.linkSite.startsWith('http://') && !this.linkSite.startsWith('https://')) {
      this.linkSite = 'http://' + this.linkSite;
    }
  }

  async formatar() {

    this.salario = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(this.vaga.salario));

    const dataLimite = new Date(this.vaga.dataLimite);

    const dia = String(dataLimite.getDate()).padStart(2, '0');
    const mes = String(dataLimite.getMonth() + 1).padStart(2, '0');
    const ano = dataLimite.getFullYear();

    this.dataExpira = `${dia}/${mes}/${ano}`;
  }

  async showMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      color: color
    })

    toast.present()
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
    }
  }


}
