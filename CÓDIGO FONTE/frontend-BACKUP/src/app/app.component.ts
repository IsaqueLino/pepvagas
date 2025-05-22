import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import {NavController, Platform} from '@ionic/angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {FcmService} from "./services/fcm.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private userTypeSubscription: Subscription;
  private userNameSubscription: Subscription;
  private userIdSubscription: Subscription;
  userType: string = '';
  userName: string = '';
  userId: any;

  adminPages = [
    {
      title: 'Home',
      url: '/listar-vaga',
      icon: 'home'
    },
    {
      title: 'Meu Perfil',
      url: '/perfil-adm',
      icon: 'person-circle-outline'
    },
    {
      title: 'Administradores',
      url: '/listar-adm',
      icon: 'shield-half-outline'
    },
    {
      title: 'Membros Equipe',
      url: '/listar-equipe',
      icon: 'people'
    },
    {
      title: 'Empresas',
      url: '/listar-empresa',
      icon: 'business'
    },
    {
      title: 'Áreas',
      url: '/listar-areas',
      icon: 'grid'
    },
    {
      title: 'Profissionais Liberais',
      url: '/listar-profissional',
      icon: 'hammer'
    },
    {
      title: 'Serviços',
      url: '/listar-servicos',
      icon: 'construct'
    },
    {
      title: 'Candidatos',
      url: '/listar-candidato',
      icon: 'people-circle'
    },
    {
      title: 'Sair',
      url: '/login',
      icon: 'exit'
    }
  ];

  equipePages = [
    {
      title: 'Meu Perfil',
      url: '/perfil-equipe',
      icon: 'person-circle-outline'
    },
    {
      title: 'Home',
      url: '/listar-vaga',
      icon: 'home'
    },
    {
      title: 'Serviços',
      url: '/listar-servicos',
      icon: 'hammer'
    },
    {
      title: 'Sair',
      url: '/login',
      icon: 'exit'
    },
  ];

  empresaPages = [
    {
      title: 'Home',
      url: '/listar-vaga',
      icon: 'home'
    },
    {
      title: 'Meu Perfil',
      url: '/perfil-empresa',
      icon: 'person-circle-outline'
    },
    {
      title: 'Representantes',
      url: '/listar-representantes',
      icon: 'business'
    },
    {
      title: 'Serviços',
      url: '/listar-servicos',
      icon: 'hammer'
    },
    {
      title: 'Sair',
      url: '/login',
      icon: 'exit'
    }
  ];

  representantePages = [
    {
      title: 'Home',
      url: '/listar-vaga',
      icon: 'home'
    },
    {
      title: 'Meu Perfil',
      url: '/perfil-representante',
      icon: 'person-circle-outline'
    },
    {
      title: 'Serviços',
      url: '/listar-servicos',
      icon: 'hammer'
    },
    {
      title: 'Sair',
      url: '/login',
      icon: 'exit'
    }
  ];


  candidatoPages = [
    {
      title: 'Home',
      url: '/listar-vaga',
      icon: 'home'
    },
    {
      title: 'Meu Perfil',
      url: '/perfil-candidato',
      icon: 'person-circle-outline'
    },
    {
      title: 'Serviços',
      url: '/listar-servicos',
      icon: 'hammer'
    },
    {
      title: 'Sair',
      url: '/login',
      icon: 'exit'
    }
  ];

  profissionalPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'

    },
    {
      title: 'Meu Perfil',
      url: '/perfil-profissional',
      icon: 'person-circle-outline'
    },
    {
      title: 'Serviços',
      url: '/listar-servicos',
      icon: 'hammer'
    },
    {
      title: 'Sair',
      url: '/login',
      icon: 'exit'
    }
  ];

  shouldShowMenu: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navCtrl: NavController,
    private platform: Platform,
    private fcmService: FcmService
  ) {
    this.userType = authService.getUserType();
    this.userName = authService.getUserName();
    this.userId = authService.getUserId();

    this.userTypeSubscription = authService.userType$.subscribe((userType) => {
      this.userType = userType; // Atualize o userType sempre que houver uma alteração
    });

    this.userNameSubscription = authService.userName$.subscribe((userName) => {
      this.userName = userName;
    });

    this.userIdSubscription = authService.userId$.subscribe((userId) => {
      this.userId = userId;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowMenu = !event.url.includes('/login');
      }
    });


  }

  iniciarApp() {
    this.platform.ready().then(() => {
      this.fcmService.initPush();

    });
  }

  ngOnInit() {
    this.userType = this.authService.getUserType();
    this.userName = this.authService.getUserName();
  }

  ngOnDestroy() {

    this.userTypeSubscription.unsubscribe();
    this.userNameSubscription.unsubscribe();
    this.userIdSubscription.unsubscribe();
  }

  navigate(url: any) {
    if (url === '/login') {
      this.logout();
    } else {
      this.navCtrl.navigateRoot(url);
    }
  }

  logout() {
    this.authService.logout();
  }

}
