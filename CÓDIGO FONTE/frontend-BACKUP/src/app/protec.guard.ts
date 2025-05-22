import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TipoUsuario } from "../../../shared/enums/TipoUsuario";
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActivatedRouteSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ProtecGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private navCtrl: NavController) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticatedUser()) {
      const routeData = route.data as { allowedUserTypes: TipoUsuario[] };
      const allowedUserTypes = routeData.allowedUserTypes;

      if (allowedUserTypes && allowedUserTypes.includes(this.authService.getUserType() as TipoUsuario)) {
        return true;
      }
      if(this.authService.getUserType() == TipoUsuario.ADMINISTRADOR){
        this.navCtrl.navigateForward('/home-adm');
        return false;
      }
      if(this.authService.getUserType() == TipoUsuario.EMPRESA){
        this.navCtrl.navigateForward('/home-empresa');
        return false;
      }
      if(this.authService.getUserType() == TipoUsuario.EQUIPE){
        this.navCtrl.navigateForward('/home-equipe');
        return false;
      }
      if(this.authService.getUserType() == TipoUsuario.LIBERAL){
        this.navCtrl.navigateForward('/home-profissional');
        return false;
      }
      if(this.authService.getUserType() == TipoUsuario.CANDIDATO){
        this.navCtrl.navigateForward('/home-candidato');
        return false;
      }

      this.navCtrl.navigateForward('/home');
      return false;
    }

    this.navCtrl.navigateForward('/login');
    return false;
  }

}
