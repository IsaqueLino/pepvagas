import { Injectable } from '@angular/core';
import {NavController} from "@ionic/angular";
import {Capacitor} from "@capacitor/core";
import {PushNotifications} from "@capacitor/push-notifications";

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor( private navCtrl: NavController,) { }

  public initPush(){
    if(Capacitor.getPlatform() !== 'web'){
      this.registerPush();
    }
  }

  private requestPermission() {
    PushNotifications.requestPermissions().then( result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.log('Sem permissão para notificações');
      }
    });
  }

  private registerPush() {

     this.requestPermission();

    PushNotifications.addListener('registration', (token) => {
      localStorage.setItem('firebaseToken', token.value);
      console.log('My token: ' + JSON.stringify(token));
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
    });


  }
}
