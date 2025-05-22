import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, IonModal, NavController, ToastController } from '@ionic/angular';
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
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
  ) {
    if (this.authService.getJwt() == null)
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
    // Busca a lista de administradores
    this.admins = await this.adminService.getAdministradores();

    // Para cada administrador, busca os detalhes da conta (incluindo email)
    for (const admin of this.admins) {
      try {
        const contaDetails = await this.authService.getContaDetails(true, admin.idconta);
        admin.email = contaDetails.email; // Adiciona o email ao objeto admin
      } catch (error) {
        console.error(`Erro ao buscar detalhes da conta para admin ${admin.idconta}:`, error);
        admin.email = 'Indisponível'; // Valor padrão em caso de erro
      }
    }

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

  async confirmarExclusao() {
    if (this.selectedIdconta == null) {
      this.showMessage("Selecione um administrador para excluir", "warning");
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir este administrador?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluirAdministrador();
          },
        },
      ],
    });

    await alert.present();
  }


  async excluirAdministrador() {
    if (this.selectedIdconta == null) return;

    let idString: string = String(this.selectedIdconta);

    if (idString == this.admin.idconta) {
      this.showMessage('Você não pode se excluir', 'danger');
      return;
    }

    try {
      await this.adminService.excluir(idString);
      await this.getAdmins();
      this.cdr.detectChanges();

      this.showMessage('Administrador excluído com sucesso!', 'success');
      this.selectedIdconta = null;
    } catch (error) {
      console.error('Erro ao excluir administrador:', error);
      this.showMessage('Erro ao excluir administrador. Tente novamente.', 'danger');
    }
  }


  async enviarAlteracao() {
    if (this.adm && this.adm.value["nome"] == null) {
      const toast = await this.toastController.create({
        message: 'O novo nome tem que ser informado para realizar a alteração',
        duration: 2000,
        position: 'bottom',
        cssClass: 'custom-dark-toast'
      });
      toast.present();
      return;
    }

    if (this.selectedIdconta !== null) {
      let id: string = String(this.selectedIdconta);

      try {
        await this.adminService.alterar(id, this.adm.value["nome"]);

        this.modal.dismiss(null, 'cancel');

        await this.getAdmins(); // atualiza lista
        this.ngOnInit();        // força o refresh

        this.showMessage('Administrador alterado com sucesso!');
      } catch (error) {
        this.showMessage('Erro ao alterar administrador.', 'danger');
      }
    }
  }


  ionViewWillEnter() {
    this.getAdmins(); // Atualiza os dados sempre que entra na página
  }


  async showMessage(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'custom-dark-toast' // classe personalizada
    });

    toast.present();
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
