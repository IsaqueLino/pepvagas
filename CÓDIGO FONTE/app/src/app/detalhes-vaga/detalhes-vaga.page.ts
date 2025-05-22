import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { VagaService } from '../services/vaga.service';
import { CandidatoService } from '../services/candidato.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-detalhes-vaga',
  templateUrl: './detalhes-vaga.page.html',
  styleUrls: ['./detalhes-vaga.page.scss'],
})
export class DetalhesVaga implements OnInit {

  public vaga: any = {};
  public candidato: any;
  private id: string = ''
  public selectedFile: File | null = null;
  public selectedOption: any = '';
  public area: any;
  public dataExpira: any;
  public salario: any;
  public isEnvironment: boolean = false;
  public fromCandidaturas: boolean = false; 


  public isDarkTheme: boolean = false

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private navigationController: NavController,
    private vagaService: VagaService,
    private candidatoService: CandidatoService,
    private route: ActivatedRoute,
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
  }

  async ngOnInit() {
    if (this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')

    this.route.queryParams.subscribe(params => {
      this.fromCandidaturas = params['fromCandidaturas'] === 'true'; 
    });

    try {
      const response = await this.authService.getContaDetails();
      this.candidato = await this.candidatoService.getCandidato(response.data?.idconta)

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
    await this.getVaga(idVaga);

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

  get isCandidatarVisible() {
    return !this.fromCandidaturas; // Se 'fromCandidaturas' for true, o botão não será exibido
  }

  async getVaga(id: string) {
    const response = await this.vagaService.getVaga(id);
    this.vaga = response.data;

    this.formatar();

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

 // Método para enviar o currículo (com arquivo)
async enviarEmailComCurriculo(file: File) {
  let resposta;
  if (file) {
    try {
      // Chama o serviço para enviar o currículo
      resposta = await this.candidatoService.enviarEmailComCurriculo(this.candidato.idconta, this.vaga.idVaga, file);

      // Verifica se a resposta foi bem-sucedida
      if (resposta && resposta.data && resposta.data.message === "Email enviado com sucesso!") {
        this.presentToast('Currículo enviado com sucesso!', 'success');
        this.navigationController.navigateBack('/'); // Navega para a página anterior (home)
        return true;  // Retorna true para indicar sucesso
      } else {
        this.presentToast('Erro ao enviar email. Tente novamente.', 'danger');
        return false;  // Retorna false em caso de falha
      }
    } catch (error) {
      console.error('Erro ao enviar currículo:', error);
      this.presentToast('Erro ao enviar email. Tente novamente.', 'danger');
      return false;  // Retorna false em caso de erro
    }
  } else {
    this.presentToast('Selecione um arquivo para enviar o email.', 'danger');
    return false;  // Retorna false se nenhum arquivo foi selecionado
  }
}

// Método para enviar o currículo do perfil (sem arquivo)
async enviarEmailComCurriculoDoPerfil() {
  let resposta;
  try {
    // Chama o serviço para enviar o currículo do perfil
    resposta = await this.candidatoService.enviarEmailComCurriculoDoPerfil(this.candidato.idconta, this.vaga.idVaga);

    // Verifica se a resposta foi bem-sucedida
    if (resposta && resposta.data && resposta.data.message === "Email enviado com sucesso!") {
      this.presentToast(resposta.data.message, 'success');
      this.navigationController.navigateBack('/'); // Navega para a página anterior (home)
      return true;  // Retorna true para indicar sucesso
    } else {
      this.presentToast('Erro ao enviar email. Tente novamente.', 'danger');
      return false;  // Retorna false em caso de falha
    }
  } catch (error) {
    console.error('Erro ao enviar currículo do perfil:', error);
    this.presentToast('Erro ao enviar email. Tente novamente.', 'danger');
    return false;  // Retorna false em caso de erro
  }
}

  async candidatar() {
    let resposta: any = '';
  
    // Se a opção selecionada for 'novo', enviar o currículo selecionado
    if (this.selectedOption === 'novo') {
      if (this.selectedFile) {
        if (this.selectedFile.name.endsWith('.pdf')) {
          if (this.selectedFile.size <= 8 * (1024 * 1024)) {
            resposta = await this.enviarEmailComCurriculo(this.selectedFile);
            if (resposta) {
              await this.candidatarNoBackend(); // Chamada ao backend
            } else {
              this.presentToast('Falha ao enviar o currículo, candidatura não realizada.', 'danger');
            }
          } else {
            this.presentToast('Selecione um arquivo que não seja maior que 8MB para enviar o currículo.', 'danger');
          }
        } else {
          this.presentToast('Selecione um arquivo PDF para enviar o currículo.', 'danger');
        }
      } else {
        this.presentToast('Selecione um arquivo para enviar o email.', 'danger');
      }
  
    // Se a opção selecionada for 'perfil', enviar o currículo do perfil
    } else if (this.selectedOption === 'perfil') {
      await this.getUser();  // Certifique-se de carregar o usuário
      if (this.candidato && this.candidato.curriculo) {
        resposta = await this.enviarEmailComCurriculoDoPerfil();
        if (resposta) {
          await this.candidatarNoBackend(); // Chamada ao backend
        } else {
          this.presentToast('Falha ao enviar o currículo, candidatura não realizada.', 'danger');
        }
      } else {
        this.presentToast('Você não possui curriculo cadastrado.', 'danger');
      }
  
    // Se nenhuma opção foi selecionada
    } else if (this.selectedOption === '') {
      this.presentToast('Selecione uma opção para enviar o email.', 'danger');
  
    // Caso ocorra um erro no envio
    } else {
      this.presentToast('Erro ao enviar email.', 'danger');
    }
  }
  
  private async candidatarNoBackend() {
    try {
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

  async showMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      color: color
    })

    toast.present()
  }
}
