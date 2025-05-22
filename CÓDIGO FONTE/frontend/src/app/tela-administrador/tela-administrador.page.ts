import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { CandidatoService } from '../services/candidato.service';
import { VagaService } from '../services/vaga.service';
import { AdministradorService } from '../services/administrador.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tela-administrador',
  templateUrl: './tela-administrador.page.html',
  styleUrls: ['./tela-administrador.page.scss'],
})
export class TelaAdministradorPage implements OnInit {

  public login: any = {}
  public isDarkTheme: boolean = false

  public userType: string = ''
  public isLogged: boolean = false
  private id: string = ''

  public admins: any = [];

  public user: any;

  public admin: any;
  public selectedIdconta: number | null = null;

  public adm: FormGroup;

  public currentPage: number = 1;
  public itemsPerPage: number = 10;


  constructor(
    private authService: AuthService,
    private navigationController: NavController,
    private toastController: ToastController,
    private adminService: AdministradorService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    if(this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')

    this.adm = this.formBuilder.group({
      nome: [null],
    });
  }

  ngOnInit() {
    this.checkTheme()

    this.getUser();
    this.getAdmins();

    if (!this.authService.getJwt())
      this.navigationController.navigateRoot('/home')
    else {
      this.isLogged = true;
    }
  }

  @ViewChild('modal1', { static: true }) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async getAdmins() {
    this.admins = await this.adminService.getAdministradores();
    this.cdr.detectChanges();
  }

  async getUser() {
    const userId = this.authService.getUser()
    const userType = this.authService.getType()
    if (userId == null) {
      this.isLogged = false
    } else {
      this.isLogged = true
      this.userType = userType ?? ''
      switch (userType) {
        case "A":
          this.admin = await this.adminService.getAdministrador(userId)
          break;
        default:
          this.navigationController.navigateRoot('/home')
          break;
      }

      // const user = await this.candidatoService.getCandidato(userId)
      // this.user = user
      this.isLogged = true
    }
  }

  onRowClick(idconta: number) {
    this.selectedIdconta = idconta;
    console.log('ID do administrador selecionado:', this.selectedIdconta);
  }

  async validateAndOpenModal() {
    if (this.selectedIdconta !== null) {
      this.modal.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Selecione um administrador para poder alterar.',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  async cancelar() {
    this.modal.dismiss(null, 'cancel');
  }

  get paginatedListaTipo() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.admins.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    this.currentPage++;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  async excluir() {
    if (this.selectedIdconta == null) {
      const toast = await this.toastController.create({
        message: 'Selecione um administrador para excluir',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      return
    }

    let idString: string = String(this.selectedIdconta)

    if (idString == this.admin.idconta) {
      this.showMessage('Você não pode se excluir', 'danger');
      return;
    }
    const resposta = this.adminService.excluir(idString)

    console.log(resposta)

    this.getAdmins()
    this.ngOnInit();

  }

  async enviarAlteracao() {

    if (this.adm && this.adm.value["nome"] == null) {
      const toast = await this.toastController.create({
        message: 'O novo nome tem que ser informado para realizar a alteração',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();

      return
    }

    if (this.selectedIdconta !== null) {

      let id: string = String(this.selectedIdconta)

      let resposta;

      resposta = this.adminService.alterar(id, this.adm.value["nome"])

      console.log(resposta)

      this.modal.dismiss(null, 'cancel');

      this.getAdmins()
      this.ngOnInit();

    }
  }
  async showMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
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
