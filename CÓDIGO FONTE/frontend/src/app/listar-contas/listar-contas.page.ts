import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController, ToastController,IonModal, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { OverlayEventDetail } from '@ionic/core/components';


@Component({
  selector: 'app-listar-contas',
  templateUrl: './listar-contas.page.html',
  styleUrls: ['./listar-contas.page.scss'],
})
export class ListarContasPage implements OnInit {

  public listaConta: any[] = [];
  public selectedIdConta: number | null = null;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  constructor(private toastController: ToastController, private contaServico: AuthService, private alertController: AlertController, private navigationController: NavController) { 
    if(this.contaServico.getJwt() == null)
      this.navigationController.navigateRoot('login')
  }

  ngOnInit() {
    this.carregarLista();
  }

  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  onRowClick(idConta: number) {
    this.selectedIdConta = idConta;
    console.log('ID da área selecionada:', this.selectedIdConta);
  }

  async carregarLista() {
    try {
      const response = await this.contaServico.listAcount();
      this.listaConta = response.data;
      console.log(this.listaConta);
    } catch (error) {
      console.error('Erro ao carregar a lista de contas:', error);
    }
  }

  get paginatedListaConta() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.listaConta.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.listaConta.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  async cancelar(){
    this.modal2.dismiss(null, 'cancel');
  }

  async excluir() {
    if (this.selectedIdConta != null) {
      const idString: string = String(this.selectedIdConta);
      const resposta = await this.contaServico.deleteAccount(idString);
      console.log(resposta);
      this.carregarLista();
      this.modal2.dismiss(null, 'cancel');

      const toast = await this.toastController.create({
        message: 'Área excluída com sucesso.',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
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
      message: 'Tem certeza de que deseja excluir a conta?',
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
