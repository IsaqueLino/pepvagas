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
  public email: string = ''
  public senha: string = ''

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
      email: [null, Validators.required],
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

    this.email = sessionStorage.getItem('email') ?? ''
    this.senha = sessionStorage.getItem('pass') ?? ''
  }

  onFileSelected(event: any) {
    const size = 8 * 1024 * 1024

    const selectedFile = event.target.files[0];

    if(event.target.files[0] != null){

      if(selectedFile != null && selectedFile.size > size){
        this.presentToast("O tamanho do banner deve ter no maximo 8 MB ")
      }else{
        this.selectedFile = selectedFile
      }
    }
  }

  logout() {
    this.authService.logout();
    sessionStorage.clear()
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
              // Remover a seleção de "Outro"
              this.obrigatorio.patchValue({
                tipo: selectedValues.filter((value: string) => value !== 'outro')
              });
            },
          },
          {
            text: 'OK',
            handler: (data) => {
              if (data.outroTipo) {
                this.tipoService.cadastrarTipo(data.outroTipo)
                const newOption = { id: data.outroTipo, nome: data.outroTipo };
                this.opcoes.push(newOption);
                this.obrigatorio.patchValue({
                  tipo: [...selectedValues.filter((value: string) => value !== 'outro'), data.outroTipo]
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
    if (this.obrigatorio.invalid) {
      Object.keys(this.obrigatorio.controls).forEach(key => {
        const control = this.obrigatorio.get(key);
        if (control && control.invalid && control.errors && control.errors['required']) {
          this.presentToast(`O campo ${key} é obrigatório. Por favor, preencha-o.`);
        }
      });
      return;
    }

    // Criação da Conta
    const conta = await this.authService.createAccount(this.email, this.senha, 'L')

    let id = conta.data.idConta.toString()

    if (!id) {
      console.log('Erro ao pegar o id');
      return;
    }

    const response = await this.profissionalService.profissionalCadastro(
      id,
      this.obrigatorio.value.nome,
      this.obrigatorio.value.nomeSocial,
      this.obrigatorio.value.descricao,
      this.obrigatorio.value.telefone,
      this.obrigatorio.value.email
    );

    if (response.status === 201 || response.status === 200) {
      localStorage.removeItem('c-user');
      this.navController.navigateRoot('login');
    }

    if (this.obrigatorio.value.tipo) {
      const responseTipo = await this.profissionalService.cadastrarTipo(id, this.obrigatorio.value.tipo);
      console.log(responseTipo);
    }

    if (this.obrigatorio.value.imagem && this.selectedFile) {
      const responseImagem = await this.profissionalService.enviarImagem(id, this.selectedFile);
      console.log(responseImagem);
    }
    
    sessionStorage.clear()
  }
}
