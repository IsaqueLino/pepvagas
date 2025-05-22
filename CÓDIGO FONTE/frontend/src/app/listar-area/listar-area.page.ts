import { Component, OnInit, ViewChild } from '@angular/core';
import { AreaService } from '../services/area.service';
import { NavController, IonModal, ToastController, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-listar-area',
  templateUrl: './listar-area.page.html',
  styleUrls: ['./listar-area.page.scss'],
})
export class ListarAreaPage implements OnInit {

  public listaArea : any = []
  public selectedIdArea: number | null = null;
  public area: FormGroup;

  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private alertController: AlertController ,private navController: NavController,  private toastController: ToastController, private areaService : AreaService, private navigationController: NavController) { 

    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')

    this.area = this.formBuilder.group({
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

  async carregarLista(){
    this.listaArea = await this.areaService.buscarTodasAreas();

    (await this.areaService.buscarTodasAreas()).subscribe(data => {
      this.listaArea = data;
    });

    console.log(this.listaArea)
  }

  onRowClick(idArea: number) {
    this.selectedIdArea = idArea;
    console.log('ID da área selecionada:', this.selectedIdArea);
  }

  async validateAndOpenModal() {
    if (this.selectedIdArea !== null) {
      this.modal.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Selecione uma área para poder alterar.',
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
    return this.listaArea.slice(startIndex, startIndex + this.itemsPerPage);
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
    if (this.selectedIdArea != null) {
      const idString: string = String(this.selectedIdArea);
      const resposta = await this.areaService.excluir(idString);
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

    if(this.area.value["nome"] == null){
      const toast = await this.toastController.create({
        message: 'O novo noem tem que ser informado para realizar a alteração',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();

      return
    }

    if(this.selectedIdArea !== null){

      let idString : string = String(this.selectedIdArea)

      const resposta = this.areaService.atualizarArea(idString, this.area.value["nome"])

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
    if (this.selectedIdArea == null) {
      this.exibirMensagem("Selecione um representante")
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir a área?',
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
