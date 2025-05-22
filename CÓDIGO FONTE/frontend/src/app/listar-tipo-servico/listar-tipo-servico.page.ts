import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, ToastController, IonModal, AlertController } from '@ionic/angular';
import { TipoServicoService } from '../services/tipo-servico.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-listar-tipo-servico',
  templateUrl: './listar-tipo-servico.page.html',
  styleUrls: ['./listar-tipo-servico.page.scss'],
})
export class ListarTipoServicoPage implements OnInit {

  public listaTipo : any = []
  public selectedIdTipo: number | null = null;
  public tipoForm: FormGroup;

  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private alertController: AlertController, private toastController: ToastController, private tipoService : TipoServicoService, private navigationController: NavController) { 
    if(this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')

    this.tipoForm = this.formBuilder.group({
      nome: [null],
    });
  }

  ngOnInit() {
    this.carregarLista()
  }

  @ViewChild('modal1', { static: true }) modal!: IonModal;
  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  onRowClick(idTipo: number) {
    this.selectedIdTipo = idTipo;
    console.log('ID da área selecionada:', this.selectedIdTipo);
  }

  async carregarLista(){
    this.listaTipo = await this.tipoService.buscarTodosServicos()

    console.log(this.listaTipo)
    
  }

  async validateAndOpenModal() {
    if (this.selectedIdTipo !== null) {
      this.modal.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Selecione uma tipo se serviço para poder alterar.',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  async cancelar(){
    this.modal.dismiss(null, 'cancel');
  }

  get paginatedListaTipo() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.listaTipo.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    this.currentPage++;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  async excluir(){
    if(this.selectedIdTipo != null){
      const idString: string = String(this.selectedIdTipo);
      const resposta = await this.tipoService.excluir(idString);
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

  async enviarAlteracao(){

    if(this.tipoForm.value["nome"] == null){
      const toast = await this.toastController.create({
        message: 'O novo nome tem que ser informado para realizar a alteração',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();

      return
    }

    if(this.selectedIdTipo !== null){

      let idString : string = String(this.selectedIdTipo)

      const resposta = this.tipoService.atualizarTipo(idString, this.tipoForm.value["nome"])

      console.log(resposta)

      this.modal.dismiss(null, 'cancel');

      this.carregarLista()

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
    if (this.selectedIdTipo == null) {
      this.exibirMensagem("Selecione um representante")
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir o tipo de serviço?',
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
