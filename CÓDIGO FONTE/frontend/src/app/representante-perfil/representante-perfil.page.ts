import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { AdministradorService } from '../services/administrador.service';
import { RepresentanteService } from '../services/representante.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-representante-perfil',
  templateUrl: './representante-perfil.page.html',
  styleUrls: ['./representante-perfil.page.scss'],
})
export class RepresentantePerfilPage implements OnInit {

  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  private userId: any
  public representante: any = {}
  public representanteAlterado: any = {}
  public conta: any = {}
  public novaSenha: {senhaAtual: string, novaSenha: string, confirmarSenha: string} = {senhaAtual: '', novaSenha: '', confirmarSenha: ''}
  public nomeEmpresa: string = ''

  constructor(private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController,
    private representanteService: RepresentanteService,
    private adminService: AdministradorService,
    ) {
      if(this.authService.getJwt() == null)
        this.navController.navigateRoot('login')
     }

  async ngOnInit() {
    this.getUser()

    this.conta = await this.authService.getContaDetails()

    this.representante = await this.representanteService.getRepresentante(this.userId)
    this.nomeEmpresa = this.representante.idEmpresa.nomeEmpresa
    this.representanteAlterado = Object.assign({}, this.representante)
  }

  @ViewChild('modal7', { static: true }) modal7!: IonModal;
  @ViewChild('modal8', { static: true }) modal8!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  cancel() {
    this.representanteAlterado = Object.assign({}, this.representante)
    this.modal7.dismiss(null, 'cancel');
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancelPassword() {
    this.modal8.dismiss(null, 'cancel');
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
          break;
        case "C":
          break;
        case "E":
          break;
        case "M":
          break;
        case "R":
          this.user = await this.representanteService.getRepresentante(this.userId)
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
        this.exibirMensagem("Nova senha deve ter no mínimo 4 caracteres.")
      }
      else if(this.novaSenha.novaSenha != this.novaSenha.confirmarSenha){
        this.exibirMensagem("A nova senha e sua confirmação não coincidem.")
      }
      else{
        const response = await this.authService.updatePassword(this.conta.idConta, this.novaSenha.senhaAtual, this.novaSenha.novaSenha, this.novaSenha.confirmarSenha);
        if (response.status === 200) {
          this.exibirMensagem("Senha atualizada com sucesso!");
          this.modal8.dismiss(null, 'confirm');
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

        const responseRepresentante = await this.representanteService.desativarRepresentante(id);

        const mensagem = responseRepresentante?.message || responseRepresentante?.data?.message;

        if (mensagem) {
            if (mensagem === "Representante desativado com sucesso!") {
                const responseConta = await this.authService.deleteAccount(id);

                if (responseConta?.data?.message) {
                    await this.exibirMensagem("Conta desativada com sucesso!");
                    this.logout();
                } else {
                    console.error('Erro ao desativar a conta. Resposta da API de conta:', responseConta);
                    this.exibirMensagem(responseConta?.data?.message || 'Erro ao desativar a conta. Tente novamente mais tarde.');
                }
            } else {
                console.error('Erro ao desativar o representante:', mensagem);
                this.exibirMensagem(mensagem);
            }
        } else {
            console.error('Resposta inválida ou sem mensagem da API de representante.');
            this.exibirMensagem('Erro ao desativar o representante. Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro ao desativar representante ou conta:', error);
        this.exibirMensagem('Ocorreu um erro ao tentar desativar o representante ou a conta. Tente novamente.');
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

  async alterarRepresentante(){
    if (this.representanteAlterado.nome.length == 0) {
      this.exibirMensagem("Informe o novo nome para o representante")
    }
    else{
      try {
        const response = await this.representanteService.alterarRepresentante(this.userId, this.representanteAlterado.nome, this.representanteAlterado.idEmpresa.idconta)

        if (response.status == 200) {
            this.modal7.dismiss(this.representanteAlterado.nome, 'confirm');
            this.ngOnInit()
            this.exibirMensagem("Representante alterado com sucesso!")
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
