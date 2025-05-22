import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { VagaService } from '../services/vaga.service';
import { CandidatoService } from '../services/candidato.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalhes-vaga',
  templateUrl: './detalhes-vaga.page.html',
  styleUrls: ['./detalhes-vaga.page.scss'],
})
export class DetalhesVaga implements OnInit {

  public vaga: any;
  public candidato: any;
  private id: string = ''
  public selectedFile: File | null = null;
  public selectedOption: any = '';
  public area: any;
  public dataExpira: any;
  public salario: any;
  public isEnvironment: boolean = false;

  public isDarkTheme: boolean = false

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private navigationController: NavController,
    private vagaService: VagaService,
    private candidatoService: CandidatoService
  ) {
    this.getUser();
  }

  async getUser() {
    const userId = this.authService.getUser()
    if (userId == null) {
      this.navigationController.navigateRoot('/');
    }

    const candidato = await this.candidatoService.getCandidato(this.authService.getUser() ?? '')
    this.candidato = candidato;
    console.log(this.candidato);
  }

  async ngOnInit() {
    if (this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')

    try {
      const response = await this.authService.getContaDetails();
      this.candidato = this.candidatoService.getCandidato(response.data.idconta)
      console.log(this.candidato)

    } catch (error) {
      console.error('Erro ao obter detalhes da conta:', error);
    }

    const idVaga = localStorage.getItem('idVaga');
    if (!idVaga) {
      this.presentToast("Erro ao encontrar a vaga",'danger');
      this.navigationController.navigateBack('/');
      return;
    }

    this.id = idVaga;
    this.getVaga(idVaga);

    /*
    */
    this.checkTheme()

    if(environment.production)
        this.isEnvironment = true
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

  async getVaga(id: string) {
    const response = await this.vagaService.getVaga(id);
    this.vaga = response.data;

    this.formatar();

    console.log(this.vaga);
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

  goBack() {
    this.navigationController.navigateRoot('/');
  }

  redirect(ref: string) {
    this.navigationController.navigateForward(ref)
  }

  async enviarEmailComCurriculo(file: File) {
    let resposta;
    if (file)
      resposta = await this.candidatoService.enviarEmailComCurriculo(this.candidato.idconta, this.vaga.idVaga, file);
    if (resposta){
      this.presentToast('Curriculo enviado com sucesso!','success');
      this.navigationController.navigateBack('/');
    } else {
      this.presentToast('Erro ao enviar email.','danger');
    }
  }

  async enviarEmailComCurriculoDoPerfil() {
    let resposta;
    resposta = await this.candidatoService.enviarEmailComCurriculoDoPerfil(this.candidato.idconta, this.vaga.idVaga);
    if (resposta){
      this.presentToast('Curriculo enviado com sucesso!','success');
      this.navigationController.navigateBack('/');
    } else {
      this.presentToast('Erro ao enviar email.','danger');
    }
  }


  candidatar() {
    let resposta: any = '';
    if (this.selectedOption === 'novo') {
      if (this.selectedFile) {
        if (this.selectedFile.name.endsWith('.pdf')) {
          if(this.selectedFile.size <= 8*(1024*1024)){
            resposta = this.enviarEmailComCurriculo(this.selectedFile);
          } else {
            this.presentToast('Selecione um arquivo que não seja maior que 8MB para enviar o currículo.','danger');
          }
        } else {
          this.presentToast('Selecione um arquivo PDF para enviar o currículo.','danger');
        }
      } else {
        this.presentToast('Selecione um arquivo para enviar o email.','danger');
      }
    } else if (this.selectedOption === 'perfil') {
      if (this.candidato.curriculo) {
        resposta = this.enviarEmailComCurriculoDoPerfil();
      } else {
        this.presentToast('O candidato não tem curriculo cadastrado.','danger');
      }
    } else if (this.selectedOption === '') {
      this.presentToast('Selecione uma opção para enviar o email.','danger');
    } else {
      this.presentToast('Erro ao enviar email.','danger');
    }

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  logout() {
    this.authService.logout()
    this.navigationController.navigateForward('login')
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getVaga(this.id)
      event.target.complete();
    }, 2000);
  }

  toggleTheme() {
    if (this.isDarkTheme)
      this.isDarkTheme = false
    else
      this.isDarkTheme = true

    this.handleTheme()
  }

  handleTheme() {

    console.log(this.isDarkTheme)

    if (this.isDarkTheme)
      document.body.setAttribute('color-scheme', 'dark')
    else
      document.body.setAttribute('color-scheme', 'light')
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }
}
