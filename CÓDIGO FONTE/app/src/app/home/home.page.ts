import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { VagaService } from '../services/vaga.service';
import { CandidatoService } from '../services/candidato.service';
//import { PushNotifications } from '@capacitor/push-notifications'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Plugins } from '@capacitor/core';

const {
  PushNotifications,
  PushNotificationToken,
  PushNotificationActionPerformed
} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private vagas: any[] = []
  public listaVagas: any = [...this.vagas]
  public isDarkTheme: boolean = false
  public user: any = {}
  public userName: string = '';

  public searchValue: string = ""

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private candidatoService: CandidatoService,
    private navigationController: NavController,
    private vagaService: VagaService
  ) {
    if (this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')
  }

  ngOnInit() {
    if (this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')


    this.checkTheme()
    this.getUser()
    setTimeout(() => {
      this.getVagas()
    }, 500)

    //setInterval(() => {
    //  this.getVagas()
    //},5000)

    // Requisitar permissão para notificações push
    // PushNotifications['requestPermission']().then( (result: { granted: any; }) => {
    //   if (result.granted) {
    //     PushNotifications['register']();
    //   } else {
    //     console.error('Permissão negada para notificações push.');
    //   }
    // });

    // Requisitar permissão para notificações push (Segunda opção)
    // PushNotifications['requestPermissions']().then((result: { receive: string; }) => {
    //   if (result.receive === 'granted') {
    //     PushNotifications['register']();
    //   } else {
    //     console.error('Permissão negada para notificações push.');
    //   }
    // });

    // Registrar evento de recebimento de token
    // PushNotifications['addListener']('registration', (token: typeof PushNotificationToken) => {
    //   console.log('Token de registro:', token['value']);
    //   // Enviar token para o servidor para envio de notificações
    // });

    // Registrar evento de erro de registro
    // PushNotifications['addListener']('registrationError', (error: any) => {
    //   console.error('Erro ao registrar para notificações push:', error);
    // });

    // Registrar evento de recebimento de notificação
    // PushNotifications['addListener']('pushNotificationReceived', (notification: Notification) => {
    //   console.log('Notificação recebida:', notification);
    // });

    // Registrar evento de ação de notificação
    // PushNotifications['addListener']('pushNotificationActionPerformed', (notification: typeof PushNotificationActionPerformed) => {
    //   console.log('Notificação clicada:', notification);
    //   // Realizar alguma ação, como redirecionar para uma página específica
    // });

    //this.registerPush();
  }

  /*
  async ionViewWillEnter() {
    this.ngOnInit()
  }
  */

  /*
  async registerPush() {
    const permStatus = await PushNotifications.requestPermissions().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications['register']();
      } else {
        console.log("Erro ao registrar PushNotification.");
      }
    });

    if (permStatus.display === 'granted') {
      console.log('Permissão aceita para notificações locais.');
    } else {
      console.error('Permissão negada para notificações locais.');
    }
  }
  */

  async getUser() {
    const user = await this.candidatoService.getCandidato(this.authService.getUser() ?? '');
    this.user = user;
    
    // Define o nome do usuário para exibição
    if (user.nome) {
      // Pega apenas o primeiro nome
      this.userName = user.nome.split(' ')[0];
    } else if (user.email) {
      // Fallback para o email (parte antes do @)
      this.userName = user.email.split('@')[0];
    } else {
      this.userName = 'Usuário';
    }
  }

  async getVagas() {
    const response = await this.vagaService.getVagas();
    this.vagas = response.data;
  
    const idCandidato = this.user?.idconta;
    if (idCandidato) {
      try {
        const candidaturas = await this.candidatoService.getCandidaturas(idCandidato);
        const idsCandidatados = candidaturas.map((c: any) => c.idVaga);
  
        this.vagas.forEach(vaga => {
          vaga.jaCandidatado = idsCandidatados.includes(vaga.idVaga);
        });
      } catch (error) {
        console.error("Erro ao buscar candidaturas do candidato:", error);
      }
    }
  
    this.listaVagas = [...this.vagas];
  
    this.matchVagas();
    this.sortVagas();
  }

  // SISTEMA DE PONTUACAO
  matchVagas() {
    this.listaVagas.filter((vaga: any) => {

      let count = 0

      if (this.user.pcd != null && vaga.pcd == this.user.pcd)
        count++

      if (this.user.pretensaoSalarial != null && vaga.salario >= this.user.pretensaoSalarial)
        count++

      if (this.user.tipoVaga != null && vaga.regime.toLowerCase() == this.user.tipoVaga.toLowerCase())
        count = count + 2

      if(this.user.areas){
        this.user.areas.forEach((area: any) => {
          if(area.idArea == vaga.idArea.idArea){
            count = count + 2
          }
        });
      }

      vaga.matchPoint = count

      //if(count>=6){ this.sendPushNotification(vaga.titulo); }

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

  async sendPushNotification(vagaTitulo: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Nova Vaga!',
          body: `Há uma vaga que combina com você: ${vagaTitulo}`,
          id: new Date().getTime(),
          schedule: { at: new Date(Date.now() + 1000) },
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  }

  verDetalhesVaga(vaga: any) {
    localStorage.setItem('idVaga', vaga.idVaga);
    this.redirect('/detalhes-vaga');
  }

  redirect(ref: string) {
    this.navigationController.navigateForward(ref)
  }

  navigationRoot(ref: string){
    this.navigationController.navigateRoot(ref)
  }

  logout() {
    this.authService.logout()
    this.navigationController.navigateRoot('login')
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getVagas()
      event.target.complete();
    }, 2000);
  }

  /*
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
  */

  search() {
    const query = this.searchValue.toLowerCase();
    
    this.listaVagas = this.vagas.filter(vaga => 
      vaga.titulo.toLowerCase().includes(query)
    );
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

}
