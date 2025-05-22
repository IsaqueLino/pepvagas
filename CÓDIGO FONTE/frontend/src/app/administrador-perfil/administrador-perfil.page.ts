import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { AdministradorService } from '../services/administrador.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-administrador-perfil',
  templateUrl: './administrador-perfil.page.html',
  styleUrls: ['./administrador-perfil.page.scss'],
})
export class AdministradorPerfilPage implements OnInit {

  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  private userId: any
  public administrador: any = {}
  public administradorAlterado: any = {}
  public conta: any = {}
  public novaSenha: {senhaAtual: string, novaSenha: string, confirmarSenha: string} = {senhaAtual: '', novaSenha: '', confirmarSenha: ''}

  constructor(private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController,
    private adminService: AdministradorService) {
      if(this.authService.getJwt() == null)
        this.navController.navigateRoot('login')
     }

  async ngOnInit() {
      this.getUser()

      this.conta = await this.authService.getContaDetails()
      console.log("Conta: ", this.conta)

      this.administrador = await this.adminService.getAdministrador(this.userId)
      console.log("Administrador: ", this.administrador)
      this.administradorAlterado = Object.assign({}, this.administrador)
  }

  @ViewChild('modal9', { static: true }) modal9!: IonModal;
  @ViewChild('modal10', { static: true }) modal10!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  confirm() {
  }

  cancel() {
    this.administradorAlterado = Object.assign({}, this.administrador)
    this.modal9.dismiss(null, 'cancel');
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancelPassword() {
    this.modal10.dismiss(null, 'cancel');
    this.novaSenha.senhaAtual = ''
    this.novaSenha.novaSenha = ''
    this.novaSenha.confirmarSenha = ''
  }

  confirmPassword() {
    this.updatePassword()
  }

  onWillDismiss(event: Event) {
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

  logout() {
    this.authService.logout()
    this.navController.navigateForward('login')
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
          this.user = await this.adminService.getAdministrador(this.userId)
          console.log(this.user)
          break;
        case "C":
          break;
        case "E":
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

  async updatePassword() {
    try {
      if (this.novaSenha.novaSenha.length < 4) {
        this.exibirMensagem("Nova senha deve ter no mínimo 4 caracteres")
      }
      else if(this.novaSenha.novaSenha != this.novaSenha.confirmarSenha){
        this.exibirMensagem("A nova senha e sua confirmação não coincidem")
      }
      else{
        const response = await this.authService.updatePassword(this.conta.idConta, this.novaSenha.senhaAtual, this.novaSenha.novaSenha, this.novaSenha.confirmarSenha);
        if (response.status === 200) {
          this.exibirMensagem("Senha atualizada com sucesso!");
          this.modal10.dismiss(null, 'confirm');
          this.novaSenha.senhaAtual = ''
          this.novaSenha.novaSenha = ''
          this.novaSenha.confirmarSenha = ''
        } else {
          this.exibirMensagem("Senha Atual incorreta");
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      this.exibirMensagem('Senha Atual incorreta');
    }
  }

  async deactivateAccount(id: string): Promise<void> {
    try {
      await this.authService.deleteAccount(id)
      console.log('Conta excluída com sucesso!')
      this.logout()
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
    }
  }

  public actionSheetButtons = [
    {
      text: 'Prosseguir',
      role: 'destructive',
      handler: () => {
        this.deactivateAccount(this.conta.idConta);
      }
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  async alterarAdministrador(){
    if (this.administradorAlterado.nome.length == 0) {
      this.exibirMensagem("Informe o novo nome para o administrador")
    }
    else{
      try {
        const response = await this.adminService.alterar(this.userId, this.administradorAlterado.nome)

        if (response.status == 200) {
            this.modal9.dismiss(this.administradorAlterado.nome, 'confirm');
            this.ngOnInit()
            this.exibirMensagem("Administrador alterado com sucesso!")
        }
        else{
          this.exibirMensagem("Erro interno no servidor")
        }

      } catch (error) {
        console.error(error)
      }
    }
  }

}
