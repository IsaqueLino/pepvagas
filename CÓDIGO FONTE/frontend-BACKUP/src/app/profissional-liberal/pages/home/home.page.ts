import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tipo_de_login:string = "";

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const opt = params['opt'];
      this.tipo_de_login = opt;
    });
  }

  navHome() {
    this.navCtrl.navigateRoot('/home');
  }
}
