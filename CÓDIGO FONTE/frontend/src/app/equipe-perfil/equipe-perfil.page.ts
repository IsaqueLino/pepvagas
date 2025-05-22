import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { AdministradorService } from '../services/administrador.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { MembroService } from '../services/membro.service';

@Component({
  selector: 'app-equipe-perfil',
  templateUrl: './equipe-perfil.page.html',
  styleUrls: ['./equipe-perfil.page.scss'],
})
export class EquipePerfilPage implements OnInit {

  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  private userId: any
  public equipe: any = {}
  public equipeAlterado: any = {}
  public conta: any = {}
  public novaSenha: {senhaAtual: string, novaSenha: string, confirmarSenha: string} = {senhaAtual: '', novaSenha: '', confirmarSenha: ''}

  constructor(private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController,
    private equipeService: MembroService,
    private adminService: AdministradorService) { 
      if(this.authService.getJwt() == null)
        this.navController.navigateRoot('login')
    }

  async ngOnInit() {
    this.getUser()

    this.conta = await this.authService.getContaDetails()

    this.equipe = await this.equipeService.getMembroEquipe(this.userId)
    this.equipeAlterado = Object.assign({}, this.equipe)
  }

  @ViewChild('modal5', { static: true }) modal5!: IonModal;
  @ViewChild('modal6', { static: true }) modal6!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  confirm() {
  }

  cancel() {
    this.equipeAlterado = Object.assign({}, this.equipe)
    this.modal5.dismiss(null, 'cancel');
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancelPassword() {
    this.modal6.dismiss(null, 'cancel');
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
          this.user = await this.equipeService.getMembroEquipe(this.userId)
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
        this.exibirMensagem("Nova senha deve ter no mínimo 4 caracteres.")
      }
      else if(this.novaSenha.novaSenha != this.novaSenha.confirmarSenha){
        this.exibirMensagem("A nova senha e sua confirmação não coincidem.")
      }
      else{
        const response = await this.authService.updatePassword(this.conta.idConta, this.novaSenha.senhaAtual, this.novaSenha.novaSenha, this.novaSenha.confirmarSenha);
        if (response.status === 200) {
          this.exibirMensagem("Senha atualizada com sucesso!");
          this.modal6.dismiss(null, 'confirm');
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

        const response = await this.equipeService.desativarMembro(id);

        const mensagem = response?.message || response?.data?.message;

        if (mensagem) {
            if (mensagem === "Membro de equipe desativado com sucesso!") {
                const responseConta = await this.authService.deleteAccount(id);

                if (responseConta?.data?.message) {
                    await this.exibirMensagem("Conta desativada com sucesso!");
                    this.logout();
                } else {
                    console.error('Erro ao desativar a conta. Resposta da API de conta:', responseConta);
                    this.exibirMensagem(responseConta?.data?.message || 'Erro ao desativar a conta. Tente novamente mais tarde.');
                }
            } else {
                console.error('Erro ao desativar :', mensagem);
                this.exibirMensagem(mensagem);
            }
        } else {
            console.error('Resposta inválida ou sem mensagem da API de representante.');
            this.exibirMensagem('Erro ao desativar . Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro ao desativar :', error);
        this.exibirMensagem('Ocorreu um erro ao tentar desativar . Tente novamente.');
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

  async alterarEquipe(){
    if (this.equipeAlterado.nome.length == 0) {
      this.exibirMensagem("Informe o novo nome para o representante")
    }
    else{
      try {
        const response = await this.equipeService.alterarMembroEquipe(this.userId, this.equipeAlterado.nome)

        if (response.status == 200) {
            this.modal5.dismiss(this.equipeAlterado.nome, 'confirm');
            this.ngOnInit()
            this.exibirMensagem("Membro da Equipe alterado com sucesso!")
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
