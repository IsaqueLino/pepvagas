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
import { AuthService } from '../services/auth.service';
import {maskitoNumberOptionsGenerator} from '@maskito/kit';

@Component({
  selector: 'app-cadastro-candidato',
  templateUrl: './cadastro-candidato.page.html',
  styleUrls: ['./cadastro-candidato.page.scss'],
})
export class CadastroCandidatoPage implements OnInit {

  obrigatorio: FormGroup;
  opcional: FormGroup;
  opcoes: any = []
  selectedFile: File | null = null;
  cidades: any = []

  email: string = ''
  senha: string = ''

  cidadesFiltro: any = []
  cidadesSelecionadas: string[] = []
  cidadesSelecionadasText: string = ''

  cidadeProcurada: any = ''

  public isDarkTheme: boolean = false
  public isLogged: boolean = false


  constructor(private formBuilder: FormBuilder, private alertController: AlertController, private authService: AuthService, private cidadeService: CidadeService, private candidatoService: CandidatoService, private navController: NavController, private toastController: ToastController, private areaService: AreaService) {

    this.email = ''
    this.senha = ''

    this.obterOpcoes()

    this.obrigatorio = this.formBuilder.group({
      nome: [null, Validators.required],
      nomeSocial: [null],
      genero: [null, Validators.required],
      cpf: [null, Validators.required],
      dataNascimento: [null, [Validators.required, this.validateDateOfBirth]],
      pcd: [null, Validators.required],
    });

    this.opcional = this.formBuilder.group({
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

    this.email = sessionStorage.getItem('email') ?? ''
    this.senha = sessionStorage.getItem('pass') ?? ''
  }

  async obterOpcoes() {

    this.opcoes = await this.areaService.getAreas();
    this.opcoes.sort((a: any, b: any) => a.nome.localeCompare(b.nome));

  }

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

  public checkboxChange(e: any){
    const details = e.detail ?? null

    if(details){
      
      if(details.checked){
        this.addOnCidades(details.value)
      }else{
        this.removeCidade(details.value)
      }

    }
  }

  public addOnCidades(cidade: string){

    const index = this.cidadesSelecionadas.indexOf(cidade)
    if(index <= -1){
      this.cidadesSelecionadas.push(cidade)
    }
    console.log("Adicionando cidades: " + this.cidadesSelecionadas)
  }

  public removeCidade(cidade: string){
    const index = this.cidadesSelecionadas.indexOf(cidade)
    if (index > -1){
      this.cidadesSelecionadas.splice(index, 1)
    }

    console.log("Cidades após remover: " + this.cidadesSelecionadas)
  }

  validatePretensaoSalarial(control: FormControl): { [key: string]: any } | null {
    if (control.value && control.value <= 0) {
      return { invalidPretensaoSalarial: true };
    }
    return null;

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

  async carregarCidades() {
    this.cidadeService.getCidades().subscribe((data: any[]) => {
      console.log(data)
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

    this.email = ''
    this.senha = ''

    this.checkTheme()
    this.carregarCidades()

    if (this.authService.getJwt()) {
      this.isLogged = true
    }

    this.email = sessionStorage.getItem('email') ?? ''
    this.senha = sessionStorage.getItem('pass') ?? ''
  }

  logout() {
    this.authService.logout()
    this.navController.navigateForward('login')
  }

  public mostrarCidades(e: Event){
    this.cidadesPopover.event = e
    this.isCidadesPopoverOpen = true
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

  dismissCidadesPopover(){
    this.cidadesSelecionadasText = this.cidadesSelecionadas.toString()
    this.cidadesSelecionadas = []
    this.isCidadesPopoverOpen = false
    console.log(this.cidadesSelecionadasText)
  }

  public handleCidadesFiltro(e: any){
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

  readonly moneyMask = maskitoNumberOptionsGenerator({
    decimalZeroPadding: true,
    precision: 2,
    decimalSeparator: ',',
    thousandSeparator: '.',
    min: 0,
    prefix: 'R$',
});

  onFileSelected(event: any) {
    const size = 8 * 1024 * 1024

    const selectedFile = event.target.files[0];

    if(event.target.files[0] != null){

      if(selectedFile != null && selectedFile.size > size){
        this.presentToast("O tamanho o curriculo deve ter no maximo 8 MB ")
      }else{
        this.selectedFile = selectedFile
      }
    }

  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  public async onSubmit() {
    if (this.obrigatorio.invalid) {
      Object.keys(this.obrigatorio.controls).forEach(key => {
        const control = this.obrigatorio.get(key);
        if (control !== null && control !== undefined && control.invalid) {
          if (control.errors && control.errors['required']) {
            this.presentToast(`O campo ${key} é obrigatório. Por favor, preencha-o.`);
          }
          if (control.errors && control.errors['invalidDateOfBirth']) {
            this.presentToast('Você deve ter mais de 18 anos para se cadastrar.');
          }
        }
      });
      return;
    }

    let hasOptionalErrors = false;

    Object.keys(this.opcional.controls).forEach(key => {
      const control = this.opcional.get(key);
      if (control !== null && control !== undefined && control.invalid) {
        if (control.errors && control.errors['required']) {
        }
        if (control.errors && control.errors['invalidPretensaoSalarial']) {
          this.presentToast('A pretensão salarial deve ser maior que zero.');
          hasOptionalErrors = true;
        }
        return
      }
    });

    if (hasOptionalErrors) {
      return;
    }

    this.email = sessionStorage.getItem('email') ?? ''
    this.senha = sessionStorage.getItem('pass') ?? ''

    // Criação da Conta
    const conta = await this.authService.createAccount(this.email, this.senha, 'C')

    console.log("CONTA: " + conta.status)

    let id = conta.data.idConta.toString()

    if (!id) {
      console.log("Erro ao pegar o id")
      return
    }

    let pretensaoSalarial: any
    if(this.opcional.value["pretensaoSalarial"] != null){
      pretensaoSalarial = this.converterParaNumero(this.opcional.value["pretensaoSalarial"]);
    }
    
    const response = await this.candidatoService.cadastroCandidato(id, this.obrigatorio.value["nome"], this.obrigatorio.value["nomeSocial"], this.obrigatorio.value["genero"], this.obrigatorio.value["cpf"], this.obrigatorio.value["dataNascimento"], this.obrigatorio.value["pcd"], this.opcional.value["disponibilidade"], this.cidadesSelecionadasText, this.opcional.value["vagaInteresse"], this.opcional.value["niviInstrucao"], this.opcional.value["cnh"], pretensaoSalarial, this.opcional.value["telefone"])
    console.log(response)


    if (this.opcional.value["areas"] != null) {
      const responseArea = await this.candidatoService.cadastrarAreas(id, this.opcional.value["areas"])
      console.log(responseArea)
    }

    if (this.opcional.value["curriculo"] != null) {
      if (this.selectedFile !== null) {
        try {
          const respostaCurriculo = await this.candidatoService.uploadFile(id, this.selectedFile);
          console.log(respostaCurriculo);
        } catch (error) {
          console.error('Erro ao enviar arquivo:', error);
        }
      } else {
        console.error('Nenhum arquivo selecionado.');
      }
    }


    if (response.status == 201) {
      localStorage.removeItem('c-user')
      this.email = ''
      this.senha = ''
      sessionStorage.clear()
      this.navController.navigateRoot('login')
    }
  }

  public async cancelar() {
    sessionStorage.clear()
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
                this.presentToast('Nova área de interesse adicionada com sucesso.');
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  converterParaNumero(valorString: any){

    if (valorString == 'R$') {
      return null
    }

    let valorNumericoString = valorString.replace(/[^\d,.]/g, '');
    valorNumericoString = valorNumericoString.replace('.', '')

    const valorNumerico = parseFloat(valorNumericoString.replace(',', '.'));

    // Verificar se o valor não é NaN (Not a Number)
    if (isNaN(valorNumerico)) {
        throw new Error(`Valor "${valorString}" não pôde ser convertido para número.`);
    }

    return valorNumerico;
}

converterParaMoeda(valorNumerico: any){
  if (isNaN(valorNumerico)) {
      throw new Error(`Valor numerico não pôde ser convertido para um número`);
  }

  const valorFormatado = valorNumerico.toFixed(2);
  const partes = valorFormatado.split('.');

  let parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  let resultado = `R$ ${parteInteira},${partes[1]}`;

  return resultado;
}


}
