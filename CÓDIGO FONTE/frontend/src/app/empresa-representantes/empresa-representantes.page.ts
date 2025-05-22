import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { EmpresaService } from '../services/empresa.service';
import { AuthService } from '../services/auth.service';

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

  constructor(private toastController: ToastController, 
    private navigationController: NavController,
    private empresaService: EmpresaService,
    private authService: AuthService,
    private alertController: AlertController) { 
      if(this.authService.getJwt() == null)
        this.navigationController.navigateRoot('login')
    }

  async ngOnInit() {
    this.getUser()
  }

  async ionViewWillEnter() {
    try {
      this.listaRepresentantes = await this.empresaService.getRepresentantesEmpresaId(this.userId)
      console.log("Representantes buscados com sucesso!")
      this.listaRepresentantes = this.listaRepresentantes.filter(representante => representante.conta !== null);
      console.log("Representantes após filtragem:", this.listaRepresentantes);
      
    } catch (error) {
      console.error(error)
    }
  }

  onRowClick(idConta: number) {
    this.selectedIdConta = idConta;
    console.log('ID da área selecionada:', this.selectedIdConta);
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
    let idString: string = String(this.selectedIdConta);
    
    try {
      const resposta = await this.authService.deleteAccount(idString);
      console.log(resposta);
      this.ionViewWillEnter();
    } catch (error) {
      console.error('Erro ao excluir a conta:', error);
    }
  }

  async getUser() {
    this.userId = this.authService.getUser()
    const userType = this.authService.getType()
    if (this.userId == null) {
      this.isLogged = false
    } else {

      this.userType = userType ?? ''
      switch (userType) {
        case "A":
          break;
        case "C":
          break;
        case "E":
          this.user = await this.empresaService.getEmpresa(this.userId)
          break;
        case "M":
          break;
        case "R":
          break;
        case "L":
          break;
      }


      // const user = await this.candidatoService.getCandidato(userId)
      // this.user = user
      this.isLogged = true
    }
  }

  cadastrarRepresentante(){
    this.navigationController.navigateForward("cadastro-representante")
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
      this.exibirMensagem("Selecione um representante")
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir representante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluir()
          },
        },
      ],
    });

    await alert.present();
  }

}
