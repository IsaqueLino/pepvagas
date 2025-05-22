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
import { ActivatedRoute } from '@angular/router'; 

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
  public vaga: any = {};
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
  public fromCandidaturas: boolean = false; 

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
    private profissionalLiberalService: ProfissionalLiberalService,
    private route: ActivatedRoute,

  ) {
  }

  async ngOnInit() {
    this.checkTheme()

    this.route.queryParams.subscribe(params => {
      this.fromCandidaturas = params['fromCandidaturas'] === 'true'; // Converte para booleano
    });

    await this.getUser();


    if (!this.authService.getJwt())
      this.isLogged = false;
    else {
      this.isLogged = true;
    }

    if (this.userType == "C") {
      try {
        const response = await this.authService.getContaDetails();
        this.candidato = await this.candidatoService.getCandidato(response.idConta)

      } catch (error) {
        console.error('Erro ao obter detalhes da conta:', error);
      }
    }

    const idVaga = localStorage.getItem('idVaga');
    if (!idVaga) {
      this.showMessage("Erro ao encontrar a vaga", 'danger');
      this.navigationController.navigateBack('home');
      return;
    }

    this.id = idVaga;
    await this.getVaga(idVaga);


    if (environment.production)
      this.isEnvironment = true

  }

  get isCandidatarVisible() {
    return !this.fromCandidaturas; // Se 'fromCandidaturas' for true, o botão não será exibido
  }

  goToHome() {
    const targetPage = this.fromCandidaturas ? '/vagas-candidatas' : '/home';
    this.navigationController.navigateForward(targetPage);
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
    if (file) {
      try {

        resposta = await this.candidatoService.enviarEmailComCurriculo(this.candidato.idconta, this.vaga.idVaga, file);

        if (resposta && resposta.data && resposta.data.message === "Email enviado com sucesso!") {
          this.showMessage('Currículo enviado com sucesso!', 'success');
          this.navigationController.navigateBack('home');
          return true;  
        } else {
          this.showMessage('Erro ao enviar email. Tente novamente.', 'danger');
          return false;  
        }
      } catch (error) {
        console.error('Erro ao enviar currículo:', error);
        this.showMessage('Erro ao enviar email. Tente novamente.', 'danger');
        return false; 
      }
    } else {
      this.showMessage('Selecione um arquivo para enviar o email.', 'danger');
      return false;  
    }
  }

  async enviarEmailComCurriculoDoPerfil() {
    let resposta;
    try {
      resposta = await this.candidatoService.enviarEmailComCurriculoDoPerfil(this.candidato.idconta, this.vaga.idVaga);

      if (resposta && resposta.data && resposta.data.message === "Email enviado com sucesso!") {
        this.showMessage(resposta.data.message, 'success');
        this.navigationController.navigateBack('home');
        return true; 
      } else {
        this.showMessage('Erro ao enviar email. Tente novamente.', 'danger');
        return false;  
      }
    } catch (error) {
      console.error('Erro ao enviar currículo do perfil:', error);
      this.showMessage('Erro ao enviar email. Tente novamente.', 'danger');
      return false;  
    }
  }

  public async candidatar() {
    if (this.isCandidato && this.isLogged) {
      let resposta: any = '';

      if (this.selectedOption === 'novo') {
        if (this.selectedFile) {
          if (this.selectedFile.name.endsWith('.pdf')) {
            if (this.selectedFile.size <= 8 * (1024 * 1024)) {
              resposta = await this.enviarEmailComCurriculo(this.selectedFile);
              if (resposta) {
                console.log('Candidatar no backend...');
                await this.candidatarNoBackend();
              } else {
                console.log('Falha ao enviar o currículo, candidatura não realizada.');
              }
            } else {
              this.showMessage('Selecione um arquivo que não seja maior que 8MB para enviar o currículo.', 'danger');
            }
          } else {
            this.showMessage('Selecione um arquivo PDF para enviar o currículo.', 'danger');
          }
        } else {
          this.showMessage('Selecione um arquivo para enviar o email.', 'danger');
        }
      } else if (this.selectedOption === 'perfil') {
        console.log('Enviando currículo do perfil...');
        this.getUser();
        if (this.candidato && this.candidato.curriculo) {
          resposta = await this.enviarEmailComCurriculoDoPerfil();
          console.log('Resposta de enviarEmailComCurriculoDoPerfil:', resposta);
          if (resposta) {
            console.log('Candidatar no backend...');
            await this.candidatarNoBackend();
          } else {
            console.log('Falha ao enviar o currículo, candidatura não realizada.');
          }
        } else {
          this.showMessage('Você não possui curriculo cadastrado.', 'danger');
        }
      } else if (this.selectedOption === '') {
        this.showMessage('Selecione uma opção para enviar o email.', 'danger');
      } else {
        this.showMessage('Erro ao enviar email.', 'danger');
      }
    } else {
      if (!this.isLogged) {
        this.showMessage("Faça login para se candidatar!", 'danger');
        return;
      }

      if (!this.isCandidato) {
        this.showMessage("Seja candidato para se candidatar!", 'danger');
        return;
      }
    }
  }

  private async candidatarNoBackend() {
    try {
      console.log('Iniciando chamada para o backend...');
      const resposta = await this.vagaService.candidatar(this.candidato.idconta, this.vaga.idVaga);


      if (resposta.data && resposta.data.message === "Candidatura registrada com sucesso!") {
        this.showMessage('Candidatura registrada com sucesso!', 'success');
      } else if (resposta.data && resposta.data.message === "O candidato já se inscreveu nesta vaga.") {
        this.showMessage('Você já se candidatou para esta vaga!', 'warning'); // Muda a mensagem
      } else {
        this.showMessage('Erro ao registrar a candidatura. Tente novamente.', 'danger');
      }
    } catch (error: any) {
      console.error('Erro ao registrar candidatura:', error);

      if (error.response && error.response.status === 409) {
        this.showMessage('Você já se candidatou para esta vaga!', 'warning');
      } else {
        this.showMessage('Erro ao registrar candidatura. Tente novamente.', 'danger');
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
