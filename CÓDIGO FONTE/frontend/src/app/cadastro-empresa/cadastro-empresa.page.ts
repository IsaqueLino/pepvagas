import { Component, OnInit } from '@angular/core';
import { MembroService } from '../services/membro.service'
import { AdministradorService } from '../services/administrador.service';
import { CandidatoService } from '../services/candidato.service';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { EmpresaService } from '../services/empresa.service';
import { cnpj } from 'cpf-cnpj-validator';

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.page.html',
  styleUrls: ['./cadastro-empresa.page.scss'],
})
export class CadastroEmpresaPage implements OnInit {

  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  public isDarkTheme: boolean = false
  public novaEmpresa: { nome: string, cnpj: string, email: string, site: string, telefone: string } = { nome: '', cnpj: '', email: '', site: '', telefone: '' }
  private id: any
  public email: string = ''
  public senha: string = ''
  public emailInvalid: boolean = false;

  public cnpjValid: boolean = true;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement()

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly fixPhoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly cnpjMask: MaskitoOptions = {
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  get currentMask(): MaskitoOptions {
    return this.novaEmpresa.telefone.length === 14 ? this.phoneMask : this.fixPhoneMask;
  }

  constructor(private toastController: ToastController,
    private authService: AuthService,
    private navController: NavController,
    private equipeService: MembroService,
    private candidatoService: CandidatoService,
    private adminService: AdministradorService,
    private empresaService: EmpresaService
  ) { }


  ngOnInit() {
    this.getUser()
    this.checkTheme()

    this.email = sessionStorage.getItem('email') ?? ''
    this.senha = sessionStorage.getItem('pass') ?? ''
  }

  validateEmail() {
    if (!this.novaEmpresa.email) {
      this.emailInvalid = false;
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = !emailRegex.test(this.novaEmpresa.email);
  }

  async onSubmit() {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.novaEmpresa.email && !emailRegex.test(this.novaEmpresa.email)) {
      this.exibirMensagem("Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).");
      return;
    }

    if (this.novaEmpresa.nome.length == 0) {
      this.exibirMensagem("Informe o nome da Empresa.")
    }
    else if (this.novaEmpresa.cnpj.length < 18) {
      this.exibirMensagem("Informe o CNPJ completo da Empresa.")
    }
    else if (this.novaEmpresa.email.length == 0) {
      this.exibirMensagem("Informe o e-mail da Empresa.")
    }
    else if (this.novaEmpresa.telefone.length != 0 && this.novaEmpresa.telefone.length < 14) {
      this.exibirMensagem("Por favor, complete o número de telefone digitado.")
    }
    else if (!cnpj.isValid(this.novaEmpresa.cnpj)) {
      this.exibirMensagem('CNPJ inválido. Por favor, insira um CNPJ válido.');
    }
    else if ((await this.empresaService.verificarCNPJRepetido(this.novaEmpresa.cnpj)).encontrado) {
      this.exibirMensagem('Já existe uma empresa cadastrada com o CNPJ informado.');
    }
    else {
      try {


        // Criação da Conta
        const conta = await this.authService.createAccount(this.email, this.senha, 'E')

        this.id = conta.data.idConta.toString()

        if (!this.id) {
          console.log("erro ao pegar o id")
          return
        }

        if (await this.isValidCNPJ(this.novaEmpresa.cnpj) == false) {
          this.exibirMensagem('CNPJ inválido. Por favor, insira um CNPJ válido.');
          return
        }
        else {
          const response = await this.empresaService.cadastrarEmpresa(this.id, this.novaEmpresa.nome,
            this.novaEmpresa.cnpj, this.novaEmpresa.email, this.novaEmpresa.telefone, this.novaEmpresa.site)

          if (response.status == 201) {
            this.exibirMensagem("Empresa " + this.novaEmpresa.nome + " cadastrada com sucesso!")
            localStorage.removeItem('c-user')
            sessionStorage.clear()
            this.navController.navigateRoot('login')
          }
        }

      } catch (error) {
        console.log(error)
        this.exibirMensagem("Erro interno no servidor")
      }
    }
  }

  async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  toggleTheme() {
    if (this.isDarkTheme)
      this.isDarkTheme = false
    else
      this.isDarkTheme = true

    this.handleTheme()
  }

  private handleTheme() {
    if (this.isDarkTheme) {
      document.body.setAttribute('color-scheme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
      this.isDarkTheme = true
    } else {
      document.body.setAttribute('color-scheme', 'light')
      this.isDarkTheme = false
    }
  }

  logout() {
    this.authService.logout()
    this.navController.navigateForward('login')
  }

  async getUser() {
    const userId = this.authService.getUser()
    const userType = this.authService.getType()
    if (userId == null) {
      this.isLogged = false
    } else {

      this.userType = userType ?? ''
      switch (userType) {
        case "A":
          this.user = await this.adminService.getAdministrador(userId)
          break;
        case "C":
          this.user = await this.candidatoService.getCandidato(userId)
          break;
        case "E":
          break;
        case "M":
          this.user = await this.equipeService.getMembroEquipe(userId)
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

  async isValidCNPJ(cnpj: string) {
    if (typeof cnpj !== "string") return false;
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs conhecidos que são inválidos
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  async deactivateAccount() {
    sessionStorage.clear()
    this.navController.navigateRoot('login')
  }

  validateCnpj() {
    this.cnpjValid = cnpj.isValid(this.novaEmpresa.cnpj)
  }

}
