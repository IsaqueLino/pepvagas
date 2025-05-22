import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { AdministradorService } from '../services/administrador.service';
import { RepresentanteService } from '../services/representante.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { EmpresaService } from '../services/empresa.service';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-empresa-perfil',
  templateUrl: './empresa-perfil.page.html',
  styleUrls: ['./empresa-perfil.page.scss'],
})
export class EmpresaPerfilPage implements OnInit {

  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  private userId: any
  public empresa: any = {}
  public empresaAlterada: any = {}
  public conta: any = {}
  public novaSenha: {senhaAtual: string, novaSenha: string, confirmarSenha: string} = {senhaAtual: '', novaSenha: '', confirmarSenha: ''}

  constructor(private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController,
    private adminService: AdministradorService,
    private empresaService: EmpresaService
  ) { 
    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')
  }

  async ngOnInit() {
    this.getUser()

    this.conta = await this.authService.getContaDetails()
    console.log("Conta: ", this.conta)

    this.empresa = await this.empresaService.getEmpresa(this.userId)
    console.log("Empresa: ", this.empresa)
    this.empresaAlterada = Object.assign({}, this.empresa)
    this.empresaAlterada.cnpj = this.formatCnpj(this.empresaAlterada.cnpj)
    this.empresaAlterada.telefone = this.formatTelefone(this.empresaAlterada.telefone)
  }

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement()

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/,  '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly cnpjMask: MaskitoOptions = {
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  readonly fixPhoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/,  '-', /\d/, /\d/, /\d/, /\d/],
  };

  get currentMask(): MaskitoOptions {
    return this.empresaAlterada.telefone.length === 14 ? this.phoneMask : this.fixPhoneMask;
  }

  @ViewChild('modal3', { static: true }) modal3!: IonModal;
  @ViewChild('modal4', { static: true }) modal4!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  cancel() {
    this.empresaAlterada = Object.assign({}, this.empresa)
    this.empresaAlterada.cnpj = this.formatCnpj(this.empresaAlterada.cnpj)
    this.empresaAlterada.telefone = this.formatTelefone(this.empresaAlterada.telefone)
    this.modal3.dismiss(null, 'cancel');
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancelPassword() {
    this.modal4.dismiss(null, 'cancel');
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
          this.modal4.dismiss(null, 'confirm');
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

  async alterarEmpresa(){
    if (this.empresaAlterada.nomeEmpresa.length == 0) {
      this.exibirMensagem("Informe o nome da Empresa")
    }
    else if (this.empresaAlterada.email.length == 0) {
      this.exibirMensagem("Informe o e-mail da Empresa")
    }
    else if (this.empresaAlterada.telefone.length != 0 && this.empresaAlterada.telefone.length < 14) {
      this.exibirMensagem("Por favor, complete o número de telefone digitado")
    }
    else{
      try {
        const response = await this.empresaService.alterarEmpresa(this.userId, this.empresaAlterada.nomeEmpresa,
          this.empresaAlterada.cnpj, this.empresaAlterada.email, this.empresaAlterada.telefone, this.empresaAlterada.site)

        if (response.status == 200) {
            this.modal3.dismiss(this.empresaAlterada.nomeEmpresa, 'confirm');
            this.ngOnInit()
            this.exibirMensagem("Empresa alterada com sucesso!")
        }
        else{
          this.exibirMensagem("Erro interno no servidor")
        }

      } catch (error) {
        console.error(error)
      }
    }
  }

  formatCnpj(cnpj: string): string {
    if (cnpj && cnpj.length === 14) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
        return cnpj;
    }
  }

  formatTelefone(telefone: string): string {
    if (!telefone) {
      return '';
    }

    telefone = telefone.replace(/\D/g, '');

    if (telefone.length === 11) {
      // celular: (XX) XXXXX-XXXX
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
      // telefone fixo: (XX) XXXX-XXXX
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return telefone;
    }
  }

  gerenciarRepresentantes(){
    this.navController.navigateForward("empresa-representantes")
  }

}
