import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { ProfissionalLiberalService } from '../services/profissional-liberal.service';
import { TipoServicoService } from '../services/tipo-servico.service';
import { AuthService } from '../services/auth.service';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-profissional-liberal-cadastro',
  templateUrl: './profissional-liberal-cadastro.page.html',
  styleUrls: ['./profissional-liberal-cadastro.page.scss'],
})
export class ProfissionalLiberalCadastroPage implements OnInit {
  obrigatorio: FormGroup;
  selectedFile: File | null = null;
  opcoes: any = [];

  public isDarkTheme: boolean = false;
  public isLogged: boolean = false;
  public email: string = '';
  public senha: string = '';
  public emailInvalid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navController: NavController,
    private toastController: ToastController,
    private profissionalService: ProfissionalLiberalService,
    private tipoService: TipoServicoService,
    private alertController: AlertController
  ) {
    this.obrigatorio = this.formBuilder.group({
      nome: [null, Validators.required],
      nomeSocial: [null],
      descricao: [null, Validators.required],
      telefone: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      tipo: [null, Validators.required],
      imagem: [null],
    });
  }

  ngOnInit() {
    this.obterOpcoes();
    this.checkTheme();

    if (this.authService.getJwt()) {
      this.isLogged = true;
    }

    this.email = sessionStorage.getItem('email') ?? '';
    this.senha = sessionStorage.getItem('pass') ?? '';
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailControl = this.obrigatorio.get('email');
    if (emailControl) {
      this.emailInvalid = emailControl.value ? !emailRegex.test(emailControl.value) : false;
    }
  }

  onFileSelected(event: any) {
    const size = 8 * 1024 * 1024;

    const selectedFile = event.target.files[0];

    if (event.target.files[0] != null) {
      if (selectedFile != null && selectedFile.size > size) {
        this.presentToast("O tamanho do banner deve ter no máximo 8 MB");
      } else {
        this.selectedFile = selectedFile;
      }
    }
  }

  logout() {
    this.authService.logout();
    sessionStorage.clear();
    this.navController.navigateForward('login');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async obterOpcoes() {
    try {
      this.opcoes = await this.tipoService.buscarTodosServicos();
      this.opcoes.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar as opções:', error);
      this.presentToast('Erro ao carregar as opções de serviços.');
    }
  }

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  private checkTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.setAttribute('color-scheme', 'dark');
    } else {
      document.body.setAttribute('color-scheme', 'light');
    }
  }

  async onTipoChange(event: any) {
    const selectedValues = event.detail.value;
    if (selectedValues.includes('outro')) {
      const alert = await this.alertController.create({
        header: 'Outro Tipo de Serviço',
        inputs: [
          {
            name: 'outroTipo',
            type: 'text',
            placeholder: 'Informe o outro tipo de serviço',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.obrigatorio.patchValue({
                tipo: selectedValues.filter((value: string) => value !== 'outro'),
              });
            },
          },
          {
            text: 'OK',
            handler: (data) => {
              if (data.outroTipo) {
                this.tipoService.cadastrarTipo(data.outroTipo);
                const newOption = { id: data.outroTipo, nome: data.outroTipo };
                this.opcoes.push(newOption);
                this.obrigatorio.patchValue({
                  tipo: [...selectedValues.filter((value: string) => value !== 'outro'), data.outroTipo],
                });
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  public async onSubmit() {
    this.validateEmail();

    if (this.emailInvalid) {
      this.presentToast("Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).");
      return;
    }

    const nome = this.obrigatorio.get('nome')?.value;
    const descricao = this.obrigatorio.get('descricao')?.value;
    const telefone = this.obrigatorio.get('telefone')?.value;
    const email = this.obrigatorio.get('email')?.value;
    const tipo = this.obrigatorio.get('tipo')?.value;

    if (!nome) {
      this.presentToast("Por favor, preencha o campo Nome.");
      return;
    } else if (!descricao) {
      this.presentToast("Por favor, preencha o campo Descrição.");
      return;
    } else if (!telefone) {
      this.presentToast("Por favor, preencha o campo Telefone.");
      return;
    } else if (!email) {
      this.presentToast("Por favor, preencha o campo Email.");
      return;
    }

    try {
      const conta = await this.authService.createAccount(this.email, this.senha, 'L');
      const id = conta.data?.idConta?.toString();

      const response = await this.profissionalService.profissionalCadastro(
        id,
        this.obrigatorio.value.nome,
        this.obrigatorio.value.nomeSocial,
        this.obrigatorio.value.descricao,
        this.obrigatorio.value.telefone,
        this.obrigatorio.value.email
      );

      if (this.obrigatorio.value.tipo) {
        const responseTipo = await this.profissionalService.cadastrarTipo(id, this.obrigatorio.value.tipo);
      }

      if (this.obrigatorio.value.imagem && this.selectedFile) {
        await this.profissionalService.enviarImagem(id, this.selectedFile);
      }

      this.presentToast("Cadastro realizado com sucesso!");
      localStorage.removeItem('c-user');
      sessionStorage.clear();
      this.navController.navigateRoot('login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.menssage || "Erro inesperado ao processar o cadastro. Tente novamente.";
      this.presentToast(errorMessage);
      console.error('Erro no onSubmit:', error);
      sessionStorage.clear();
      this.navController.navigateRoot('criar-conta');
    }
  }
}