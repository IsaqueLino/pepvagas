import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CidadeService } from '../services/cidade.service';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { AreaService } from '../services/area.service';
import { EmpresaService } from '../services/empresa.service';
import { VagaService } from '../services/vaga.service';
import { RepresentanteService } from '../services/representante.service';
import { MaskitoDirective, MaskitoPipe } from '@maskito/angular';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';

@Component({
  selector: 'app-cadastro-vaga',
  templateUrl: './cadastro-vaga.page.html',
  styleUrls: ['./cadastro-vaga.page.scss'],
})
export class CadastroVagaPage implements OnInit {

  cidades: any = []
  cidadesFiltro: any = []
  areas: any = []
  empresas: any = []
  userId: any = []
  vaga: any = {
    ocultarNome: 'N' // Valor padrão 'N'
  }
  userType: any = ''

  cidadesSelecionadas: string[] = []
  cidadeSelecionadasText: string = ''

  cidadeProcurada: any = ''

  public emailInvalid: boolean = false;

  @ViewChild('cidadesPopover') cidadesPopover: any;
  isCidadesPopoverOpen: boolean = false;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();


  readonly salarioMask: MaskitoOptions = {
    mask: ['R$', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ',', /\d/, /\d/],
  }

  readonly moneyMask = maskitoNumberOptionsGenerator({
    decimalZeroPadding: true,
    precision: 2,
    decimalSeparator: ',',
    thousandSeparator: '.',
    min: 0,
    prefix: 'R$',
  });

  constructor(
    private authService: AuthService,
    private cidadeService: CidadeService,
    private navController: NavController,
    private toastController: ToastController,
    private areaService: AreaService,
    private empresaService: EmpresaService,
    private vagaService: VagaService,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private representanteService: RepresentanteService
  ) { }

  ngOnInit() {
    this.checkTheme()
    this.carregarCidades()
    this.obterAreas()
    this.obterEmpresas()

    this.userId = this.authService.getUser()
    this.userType = this.authService.getType()

    if (this.authService.getJwt() == null)
      this.navController.navigateRoot('login')
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = this.vaga.emailCurriculo ? !emailRegex.test(this.vaga.emailCurriculo) : false;
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

  public checkboxChange(cidade: string) {
    this.cidadeSelecionadasText = cidade
    this.vaga.cidade = cidade
    this.dismissCidadesPopover()
  }

  dismissCidadesPopover() {
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

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
    }
  }

  public async cancelar() {
    this.navController.navigateForward('login')
  }

  async carregarCidades() {
    this.cidadeService.getCidades().subscribe((data: any[]) => {
      this.cidades = data.map((cidade: any) => cidade.nome);
      this.cidadesFiltro = [...this.cidades]
    });
  }

  async obterAreas() {

    (await this.areaService.buscarTodasAreas()).subscribe(data => {
      this.areas = data;
      this.areas.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    });

    // this.areas.sort((a: any, b: any) => a.nome.localeCompare(b.nome));

    // this.areas.sort((a: any,b: any) => (a.))
    
  }

  async obterEmpresas() {
    this.empresas = await this.empresaService.getEmpresas()
  }

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    })

    toast.present()
  }

  async onSubmit() {

    if (await this.verifyData())
      return

    let vagaSalario = this.converterParaNumero(this.vaga.salario)

    if (this.vaga.pcd == 1)
      this.vaga.pcd = true
    else
      this.vaga.pcd = false

      if (this.userId && this.userType) {
        if (this.userType == 'E') {
            this.vaga.idEmpresa = Number(this.userId);
        } else if (this.userType == 'R') {
            this.vaga.idEmpresa = await this.representanteService.getEmpresaDoRepresentante(this.userId);
            if (!this.vaga.idEmpresa) {
                this.showMessage("Erro ao recuperar a empresa do representante.");
                return;
            }
        }

      await this.vagaService.create({
        "idConta": +this.userId,
        "titulo": this.vaga.titulo,
        "modalidade": this.vaga.modalidade,
        "tipo": this.vaga.tipo,
        "regime": this.vaga.regime,
        "descricao": this.vaga.descricao,
        "salario": vagaSalario,
        "pcd": this.vaga.pcd,
        "dataLimite": this.vaga.dataLimite,
        "cidade": this.vaga.cidade,
        "nivelInstrucao": this.vaga.nivelInstrucao,
        "site": this.vaga.site ?? null,
        "idArea": this.vaga.idArea.id ?? this.vaga.idArea.idArea,
        "emailCurriculo": this.vaga.emailCurriculo,
        "idEmpresa": +this.vaga.idEmpresa,
        "ocultarNome": this.vaga.ocultarNome
      }).then(response => {
        if (response.status == 201) {

          const imgResponse = this.vagaService.sendLogoAndBanner(response.data.idVaga, this.vaga.logo, this.vaga.banner)

          this.showMessage("Vaga publicada com sucesso!")
          this.navController.navigateRoot('home')
        }
      })
    }
  }

  async verifyData() {
    this.validateEmail();
    
    if (this.emailInvalid) {
      this.showMessage("Por favor, insira um e-mail válido para recebimento de currículos");
      return true;
    }

    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    amanha.setHours(0, 0, 0, 0);

    if (this.vaga.dataLimite == null) {
      this.showMessage("Preencha a data de encerramento da vaga.");
      return true;
    } else {
      const dataLimite = new Date(this.vaga.dataLimite);
      if (isNaN(dataLimite.getTime()) || dataLimite < amanha) {
        this.showMessage("Insira uma data de encerramento que esteja no futuro.");
        return true;
      }
    }

    if (this.vaga.titulo == null || this.vaga.titulo.trim() == "") {
      this.showMessage("Preencha o título da vaga.")
    } else if (this.vaga.salario == null) {
      this.showMessage("Preencha o salário da vaga.")
    } else if (this.vaga.descricao == null || this.vaga.descricao.trim() == "") {
      this.showMessage("Preencha os detalhes da vaga.")
    } else if (this.vaga.tipo == null) {
      this.showMessage("Preencha o turno da vaga.")
    } else if (this.vaga.regime == null) {
      this.showMessage("Preencha o regime da vaga.")
    } else if (this.vaga.modalidade == null) {
      this.showMessage("Preencha a modalidade da vaga.")
    } else if (this.vaga.idArea == null) {
      this.showMessage("Preencha a área da vaga.")
    } else if (this.vaga.cidade == null) {
      this.showMessage("Preencha a cidade da vaga.")
    } else if (this.vaga.idEmpresa == null && this.userType != "E" && this.userType != "R") {
      this.showMessage("Preencha a empresa da vaga.")
    } else if (this.vaga.nivelInstrucao == null) {
      this.showMessage("Preencha o nível de instrução da vaga.")
    } else if (this.vaga.emailCurriculo == null) {
      this.showMessage("Preencha o email de currículos da vaga.")
    } else {
      return false
    }
    return true
  }

  onLogoSelected(e: any) {
    const file = e.target.files[0]

    if (e.target.files[0] != null) {
      this.verifyFileSize(file) ? this.showMessage("Tamanho do arquivo deve ser de até 8MB") : this.vaga.logo = file
    }
  }

  onBannerSelected(e: any) {
    const file = e.target.files[0]

    if (e.target.files[0] != null) {
      this.verifyFileSize(file) ? this.showMessage("Tamanho do arquivo deve ser de até 8MB") : this.vaga.banner = file
    }
  }

  public verifyFileSize(file: any) {
    const size = 8 * 1024 * 1024

    if (file.size > size) {
      return true
    }
    return false
  }


  async onAreaChange(event: any) {
    const selectedValue = event.detail.value;
    if (selectedValue == "outro") {
      const alert = await this.alertController.create({
        header: 'Outra Área de Interesse',
        inputs: [
          {
            name: 'outraArea',
            type: 'text',
            placeholder: 'Informe a nova área',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.vaga.idArea = ""
            },
          },
          {
            text: 'OK',
            handler: async (data: any) => {
              if (data.outraArea) {
                // Chama o serviço para cadastrar a nova área
                const response = await this.areaService.cadastrarArea(data.outraArea);
                // Adiciona a nova área às opções
                const newOption = { id: response.data.id, nome: data.outraArea };
                this.areas.push(newOption);
                // Atualiza as áreas selecionadas
                this.vaga.idArea = newOption
                // Exibe a mensagem de sucesso
                this.showMessage('Nova área de interesse adicionada com sucesso!');
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  converterParaNumero(valorString: any) {
    if (valorString == 'R$') {
      return null
    }

    let valorNumericoString = valorString.replace(/[^\d,.]/g, '');
    valorNumericoString = valorNumericoString.replace('.', '')

    const valorNumerico = parseFloat(valorNumericoString.replace(',', '.'));

    if (isNaN(valorNumerico)) {
      throw new Error(`Valor "${valorString}" não pôde ser convertido para número.`);
    }

    return valorNumerico;
  }

}
