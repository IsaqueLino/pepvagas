import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ToastController} from '@ionic/angular';
import {AxiosError} from 'axios';
import {api} from '../services/axios';
import {AuthService} from '../services/auth.service';
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {auth} from '../services/firebase';
import {TipoUsuario} from '../../../../shared/enums/TipoUsuario';
import {LoginData} from './loginData';
import {FcmService} from "../services/fcm.service";


const REFRESH_TOKEN_INTERVAL_MS = 1000 * 60 * 55; // 55 minutos

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})


export class LoginPage {
  public email: string = "";
  public senha: string = "";
  public type = 'password';
  public showPass = false;
  data: LoginData = {
    tipoUsuario: ' ',
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private authService: AuthService,
    private fcmService: FcmService,
  ) {
  }

  ngOnInit() {
    this.data.tipoUsuario = 'default';
    setInterval(() => {
      this.refreshToken();
    }, REFRESH_TOKEN_INTERVAL_MS);
  }

  async refreshToken() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await api.get(`/refresh-token/`, {headers});

      if (response.status === 200) {
        const {token} = response.data;
        localStorage.setItem('token', token);
        return token;
      }

      if (response.status === 401) {
        this.showToast('Erro ao atualizar token', 'danger');
        this.logout();
      }
    } catch (error) {
      this.showToast('Erro ao atualizar token', 'danger');
      this.logout();
    }
  }

  onEmailChange(event: any) {
    this.email = event.target.value;
  }

  onSenhaChange(event: any) {
    this.senha = event.target.value;
  }


  handleGoogleSignIn() {

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        this.authService.setUserId(user?.uid || '');
        this.authService.setUserName(user?.displayName || '');
        this.authService.setUserType('Administrador');
        localStorage.setItem('token', token || '');
        localStorage.setItem('userId', user?.uid || '');
        localStorage.setItem('userName', user?.displayName || '');
        localStorage.setItem('userType', 'Administrador');
        if (token && user) {
          this.navCtrl.navigateRoot('/home-adm');
        }
      }).catch((error) => {
      console.log(error);
    });

  }

  async logout() {
    try {
      await auth.signOut();
      this.clearLocalStorage();
      this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.log(error);
    }
  }

  async autenticar() {
    try {
      let endpoint = '';

      switch (this.data.tipoUsuario) {
        case 'default':
          endpoint = '/login-admin';
          break;

        case 'Candidato':
          endpoint = '/login-candidato';
          break;

        case 'Empresa':
          endpoint = '/login-empresa';
          break;

        case 'Equipe':
          endpoint = '/login-equipe';
          break;

        case 'Representante':
          endpoint = '/login-representante';
          break;

        case 'ProfissionalLiberal':
          endpoint = '/login-profissional';
          break;

        default:
          break;
      }

      if (endpoint !== '') {
        const response = await api.post(endpoint, {
          email: this.email,
          senha: this.senha
        });

        if (response.status === 200) {
          const {id, tipo, token, usuario} = response.data;

          this.clearLocalStorage();

          this.authService.setUserId(id);
          this.authService.setUserName(usuario);
          this.authService.setUserType(tipo);
          localStorage.setItem('token', token);
          localStorage.setItem('userId', id);
          localStorage.setItem('userName', usuario);
          localStorage.setItem('userType', tipo);


          if (tipo === TipoUsuario.CANDIDATO) {

            this.fcmService.initPush();

            const token = localStorage.getItem('firebaseToken');
            if (token) {
              await api.put(`/set-firebase-token/${id}`, {
                token
              })
            }
          }

          //apresentar mensagem vindo do backend
          if (response.data.message) {
            this.showToast(response.data.message, 'success');
          }


          this.navigateToDestination(tipo);


        }
      }
    } catch (error) {
      this.showToast('Erro ao realizar login', 'danger');
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    this.authService.setUserId('');
    this.authService.setUserName('');
    this.authService.setUserType('');
  }

  navigateToDestination(tipo: string) {
    switch (tipo) {
      case 'Administrador':
        this.navCtrl.navigateRoot('/listar-vaga');
        break;

      case 'Equipe':
        this.navCtrl.navigateRoot('/listar-vaga');
        break;

      case 'Candidato':
        this.navCtrl.navigateRoot('/listar-vaga');
        break;

      case 'Empresa':
        this.navCtrl.navigateRoot('/listar-vaga');
        break;

      case 'Representante':
        this.navCtrl.navigateRoot('/listar-vaga');
        break;

      case 'ProfissionalLiberal':
        this.navCtrl.navigateRoot('/home');
        break;

      default:
        break;
    }
  }

  async onTipoUsuarioChange(event: any) {
    this.data.tipoUsuario = event.target.value;
  }


  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
      color: color,
    });

    toast.present();
  }

  recuperarSenha() {
    this.navCtrl.navigateRoot('/recovery');
  }

  criarConta() {
    this.navCtrl.navigateForward('/cadastro-geral');
  }

  showPassword() {
    let eyeicon = document.getElementById('eye');
    let pass = document.getElementById('senha');

    if (this.showPass) {
      this.showPass = false;
      this.type = 'password';
      eyeicon?.setAttribute('src', '../../assets/icon/eye-open.png');
    } else {
      this.showPass = true;
      this.type = 'text';
      eyeicon?.setAttribute('src', '../../assets/icon/eye-close.png');
    }
  }
}
