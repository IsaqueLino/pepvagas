import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CandidatoService } from '../services/candidato.service';
import { AreaService } from '../services/area.service';
import { AlertController, NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { LoginPage } from '../login/login.page';
import { CidadeService } from '../services/cidade.service';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { cpf } from 'cpf-cnpj-validator';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-cadastro-candidato',
  templateUrl: './cadastro-candidato.page.html',
  styleUrls: ['./cadastro-candidato.page.scss'],
})
export class CadastroCandidatoPage implements OnInit {

  obrigatorio: FormGroup;
  opcional: FormGroup;
  opcoes: any = []
  cidades: any = []

  cidadesFiltro: any = []
  cidadesSelecionadas: string[] = []
  cidadesSelecionadasText: string = ''

  cidadeProcurada: any = ''

  selectedFile: File | null = null;

  public cpfValid: boolean = true;


  constructor(private formBuilder: FormBuilder, private cidadeService: CidadeService, private candidatoService: CandidatoService, private navController: NavController, private toastController: ToastController, private areaService: AreaService, private alertController: AlertController, private authService: AuthService) {

    this.obterOpcoes()

    this.obrigatorio = this.formBuilder.group({
      nome: [null, Validators.required],
      genero: [null, Validators.required],
      cpf: [null, Validators.required],
      dataNascimento: [null, [Validators.required, this.validateDateOfBirth]],
      pcd: [null, Validators.required],
    });

    this.opcional = this.formBuilder.group({
      nomeSocial: [null],
      disponibilidade: [null],
      cidadeInteresse: [[]],
      vagaInteresse: [null],
      niviInstrucao: [null],
      cnh: [null],
      pretensaoSalarial: [null, [Validators.required, this.validatePretensaoSalarial]],
      telefone: [null],
      curriculo: [null],
      areas: [null]
    })
  }

  async obterOpcoes() {

    this.opcoes = await this.areaService.getAreas();
    this.opcoes.sort((a: any, b: any) => a.nome.localeCompare(b.nome));

  }

  readonly moneyMask = maskitoNumberOptionsGenerator({
    decimalZeroPadding: true,
    precision: 2,
    decimalSeparator: ',',
    thousandSeparator: '.',
    min: 0,
    prefix: 'R$',
  });

  validateDateOfBirth(control: FormControl): { [key: string]: boolean } | null {
    if (control.value) {

      const birthDate = new Date(control.value);

      const currentDate = new Date();

      const age = currentDate.getFullYear() - birthDate.getFullYear();

      if (age <= 16) {
        return { invalidDateOfBirth: true };
      }
    }
    return null;
  }

  validatePretensaoSalarial(control: FormControl): { [key: string]: any } | null {
    if (control.value && control.value <= 0) {
      return { invalidPretensaoSalarial: true };
    }
    return null;

  }

  async carregarCidades() {
    this.cidadeService.getCidades().subscribe((data: any[]) => {
      this.cidades = data.map((cidade: any) => cidade.nome);
      this.cidadesFiltro = [...this.cidades]
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  ngOnInit() {
    this.checkTheme()
    this.carregarCidades()
  }

  @ViewChild('cidadesPopover') cidadesPopover: any;
  isCidadesPopoverOpen: boolean = false;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly cpfMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  }

  dismissCidadesPopover() {
    this.cidadesSelecionadasText = this.cidadesSelecionadas.toString()
    this.cidadesSelecionadas = []
    this.isCidadesPopoverOpen = false
  }

  public handleCidadesFiltro(e: any) {
    const query = e.target.value.toLowerCase();

    if (query == '') {
      this.cidadesFiltro = [...this.cidades]
      return this.cidadesFiltro
    }

    this.cidadesFiltro = this.cidadesFiltro.filter((cidade: any) => {
      if (cidade.toLowerCase().indexOf(query) > -1) {
        return cidade
      }
    })
  }

  public checkboxChange(e: any) {
    const details = e.detail ?? null

    if (details) {

      if (details.checked) {
        this.addOnCidades(details.value)
      } else {
        this.removeCidade(details.value)
      }

    }
  }

  public mostrarCidades(e: Event) {
    this.cidadesPopover.event = e
    this.isCidadesPopoverOpen = true
  }

  public addOnCidades(cidade: string) {

    const index = this.cidadesSelecionadas.indexOf(cidade)
    if (index <= -1) {
      this.cidadesSelecionadas.push(cidade)
    }
  }

  public removeCidade(cidade: string) {
    const index = this.cidadesSelecionadas.indexOf(cidade)
    if (index > -1) {
      this.cidadesSelecionadas.splice(index, 1)
    }

  }

  onFileSelected(event: any) {
    const size = 8 * 1024 * 1024

    const selectedFile = event.target.files[0];

    if (event.target.files[0] != null) {

      if (selectedFile != null && selectedFile.size > size) {
        this.presentToast("O tamanho o curriculo deve ter no maximo 8 MB ")
      } else {
        this.selectedFile = selectedFile
      }
    }
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  public async onSubmit() {
    // Validação dos campos obrigatórios
    if (!this.obrigatorio.value["nome"]) {
      this.presentToast("Por favor, preencha o campo Nome.");
      return;
    }
    if (!this.obrigatorio.value["genero"]) {
      this.presentToast("Por favor, preencha o campo Sexo.");
      return;
    }
    if (!this.obrigatorio.value["cpf"]) {
      this.presentToast("Por favor, preencha o campo CPF.");
      return;
    }
    if (!this.obrigatorio.value["dataNascimento"]) {
      this.presentToast("Por favor, preencha o campo Data de Nascimento.");
      return;
    }
    if (this.obrigatorio.value["pcd"] === null || this.obrigatorio.value["pcd"] === undefined) {
      this.presentToast("Por favor, preencha o campo PCD.");
      return;
    }
  
    // Validação de idade (mais de 16 anos)
    const birthDate = new Date(this.obrigatorio.value["dataNascimento"]);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age <= 16) {
      this.presentToast("Você deve ter mais de 16 anos para se cadastrar.");
      return;
    }
  
    // Validação de CPF
    const cpfValue = this.obrigatorio.value["cpf"];
    if (!cpf.isValid(cpfValue)) {
      this.presentToast("CPF inválido. Por favor, insira um CPF válido.");
      return;
    }
  
    // Verificação de CPF repetido
    if ((await this.candidatoService.verificarCPFRepetido(cpfValue)).encontrado) {
      this.presentToast("Já existe um candidato cadastrado com o CPF informado.");
      return;
    }
  
    // Validação dos campos opcionais
    let hasOptionalErrors = false;
    Object.keys(this.opcional.controls).forEach(key => {
      const control = this.opcional.get(key);
      if (control !== null && control !== undefined && control.invalid) {
        if (control.errors && control.errors['invalidPretensaoSalarial']) {
          this.presentToast("A pretensão salarial deve ser maior que zero.");
          hasOptionalErrors = true;
        }
      }
    });
  
    if (hasOptionalErrors) {
      return;
    }
  
    // Converter pretensaoSalarial para número
    let pretensaoSalarial = this.opcional.value["pretensaoSalarial"];
    if (pretensaoSalarial) {
      // Remove formatação (R$, separadores de milhar e converte vírgula para ponto)
      pretensaoSalarial = parseFloat(
        pretensaoSalarial
          .replace('R$', '') // Remove o prefixo R$
          .replace(/\./g, '') // Remove separadores de milhar
          .replace(',', '.') // Converte vírgula para ponto
          .trim()
      );
    } else {
      pretensaoSalarial = null; // Caso o campo seja opcional e esteja vazio
    }
  
    const responseCreateAccount = await this.authService.createAccount(localStorage.getItem("candidato_email"), localStorage.getItem("candidato_senha"), "C");
  
    if (responseCreateAccount.status == 201) {
      this.authService.setCreationUser(responseCreateAccount.data.idConta);
    } else if (responseCreateAccount.status == 409) {
      this.presentToast(responseCreateAccount.response.data.message);
      return;
    }
  
    let id = localStorage.getItem("c-user");
    if (!id) {
      console.log("erro ao pegar o id");
      return;
    }
  
    const response = await this.candidatoService.cadastroCandidato(id, this.obrigatorio.value["nome"], this.opcional.value["nomeSocial"], this.obrigatorio.value["genero"], this.obrigatorio.value["cpf"], this.obrigatorio.value["dataNascimento"], this.obrigatorio.value["pcd"], this.opcional.value["disponibilidade"], this.cidadesSelecionadasText, this.opcional.value["vagaInteresse"], this.opcional.value["niviInstrucao"], this.opcional.value["cnh"], pretensaoSalarial, this.opcional.value["telefone"]);
  
    if (this.opcional.value["areas"] != null) {
      const responseArea = await this.candidatoService.cadastrarAreas(id, this.opcional.value["areas"]);
    }
  
    if (this.opcional.value["curriculo"] != null) {
      if (this.selectedFile !== null) {
        try {
          const respostaCurriculo = await this.candidatoService.uploadFile(id, this.selectedFile);
        } catch (error) {
          console.error('Erro ao enviar arquivo:', error);
        }
      } else {
        console.error('Nenhum arquivo selecionado.');
      }
    }
  
    if (response.status == 201) {
      localStorage.removeItem('c-user');
      this.presentToast("Conta cadastrada com sucesso!");
      this.navController.navigateRoot('login');
    }
  }

  public async cancelar() {
    this.navController.navigateForward('login')
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
    }
  }

  async onAreaChange(event: any) {
    const selectedValues = event.detail.value;
    if (selectedValues.includes('outro')) {
      const alert = await this.alertController.create({
        header: 'Outra Área de Interesse',
        inputs: [
          {
            name: 'outraArea',
            type: 'text',
            placeholder: 'Informe a nova área de interesse',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.opcional.patchValue({
                areas: selectedValues.filter((value: string) => value !== 'outro')
              });
            },
          },
          {
            text: 'OK',
            handler: async (data) => {
              if (data.outraArea) {

                this.areaService.cadastrarArea(data.outraArea)
                const newOption = { id: data.outraArea, nome: data.outraArea };
                this.opcoes.push(newOption);
                this.opcional.patchValue({
                  areas: [...selectedValues.filter((value: string) => value !== 'outro'), data.outraArea]
                });
                this.presentToast('Nova área de interesse adicionada com sucesso!');
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  validateCpf() {
    this.cpfValid = cpf.isValid(this.obrigatorio.value["cpf"])
  }

}
