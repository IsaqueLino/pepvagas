import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { EmpresaService } from '../services/empresa.service';
import { AuthService } from '../services/auth.service';
import { RepresentanteService } from '../services/representante.service';

@Component({
  selector: 'app-empresa-representantes',
  templateUrl: './empresa-representantes.page.html',
  styleUrls: ['./empresa-representantes.page.scss'],
})
export class EmpresaRepresentantesPage implements OnInit {

  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  private userId: any
  public listaRepresentantes: any[] = [];
  public selectedIdConta: number | null = null;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  constructor(
    private toastController: ToastController,
    private navigationController: NavController,
    private empresaService: EmpresaService,
    private authService: AuthService,
    private alertController: AlertController,
    private representanteService: RepresentanteService
  ) {
    if (this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')
  }

  async ngOnInit() {
    await this.getUser();
  }

  async ionViewWillEnter() {
    await this.carregarRepresentantes();
  }

  async carregarRepresentantes() {
    try {
      this.listaRepresentantes = await this.empresaService.getRepresentantesEmpresaId(this.userId);
      this.listaRepresentantes = this.listaRepresentantes.filter(representante => representante.conta !== null);
    } catch (error) {
    }
  }

  onRowClick(idConta: number) {
    this.selectedIdConta = idConta;
  }

  get paginatedListaRepresentante() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.listaRepresentantes.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.listaRepresentantes.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  async excluir() {
    if (this.selectedIdConta == null) {
      this.exibirMensagem("Selecione um representante");
      return;
    }

    const idString: string = String(this.selectedIdConta);

    try {

      // Desativa o representante
      const responseRepresentante = await this.representanteService.desativarRepresentante(idString);
      const mensagem = responseRepresentante?.message || responseRepresentante?.data?.message;

      if (mensagem === "Representante desativado com sucesso!") {
        const responseConta = await this.authService.deleteAccount(idString);

        if (responseConta?.data?.message) {
          this.exibirMensagem("Conta desativada com sucesso!");
          await this.carregarRepresentantes(); 
          this.selectedIdConta = null;
        } else {
          this.exibirMensagem(responseConta?.data?.message || 'Erro ao desativar a conta.');
        }

      } else {
        this.exibirMensagem(mensagem || "Erro ao desativar o representante.");
      }

    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao desativar representante ou conta.";
      this.exibirMensagem(mensagem);
    }
  }

  async getUser() {
    this.userId = this.authService.getUser();
    const userType = this.authService.getType();
    if (this.userId == null) {
      this.isLogged = false;
    } else {
      this.userType = userType ?? '';
      if (this.userType === "E") {
        this.user = await this.empresaService.getEmpresa(this.userId);
      }
      this.isLogged = true;
    }
  }

  cadastrarRepresentante() {
    this.navigationController.navigateForward("cadastro-representante");
  }

  async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async confirmarExclusao() {
    if (this.selectedIdConta == null) {
      this.exibirMensagem("Selecione um representante");
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir o representante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluir();
          },
        },
      ],
    });

    await alert.present();
  }
}
