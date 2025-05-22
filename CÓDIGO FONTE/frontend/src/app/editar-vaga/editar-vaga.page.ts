import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CidadeService } from '../services/cidade.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AreaService } from '../services/area.service';
import { EmpresaService } from '../services/empresa.service';
import { VagaService } from '../services/vaga.service';
import {maskitoNumberOptionsGenerator} from '@maskito/kit';
import {MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { parse, parseNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-editar-vaga',
  templateUrl: './editar-vaga.page.html',
  styleUrls: ['./editar-vaga.page.scss'],
})
export class EditarVagaPage implements OnInit {

  cidades: any = []
  cidadesFiltro: any = []
  areas: any = []
  empresas: any = []
  userId: any = []
  vaga: any = {}
  userType: any = ''
  idVaga: any = ''
  public emailInvalid: boolean = false;

  cidadesSelecionadas: string[] = []
  cidadeSelecionadasText: string = ''

  cidadeProcurada: any = ''

  @ViewChild('cidadesPopover') cidadesPopover: any;
  isCidadesPopoverOpen: boolean = false;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

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
    private alertController: AlertController
  ) { 
    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')
  }

  ngOnInit() {
    this.checkTheme()
    this.carregarCidades()
    this.obterAreas()
    this.obterEmpresas()
    
    this.userId = this.authService.getUser()
    this.userType = this.authService.getType()
    this.idVaga = localStorage.getItem('idVaga') ?? null
    
    this.obterVaga()
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = this.vaga.emailCurriculo ? !emailRegex.test(this.vaga.emailCurriculo) : false;
  }

  public mostrarCidades(e: Event){
    this.cidadesPopover.event = e
    this.isCidadesPopoverOpen = true
  }

  public addOnCidades(cidade: string){
    const index = this.cidadesSelecionadas.indexOf(cidade)
    if(index <= -1){
      this.cidadesSelecionadas.push(cidade)
    }
  }

  public checkboxChange(cidade: string){
    this.cidadeSelecionadasText = cidade
    this.vaga.cidade = cidade
    this.dismissCidadesPopover()
  }

  dismissCidadesPopover(){
    this.cidadesSelecionadas = []
    this.isCidadesPopoverOpen = false
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
  }

  async obterEmpresas() {
    this.empresas = await this.empresaService.getEmpresas()
  }

  async obterVaga(){
    if(this.idVaga){
      const vaga = await this.vagaService.getVaga(this.idVaga)
      this.vaga = vaga.data
      this.vaga.idArea = vaga.data.idArea.idArea
      this.vaga.pcd = (vaga.data.pcd == true) ? "1" : "0"
      this.vaga.ocultarNome = vaga.data.ocultarNome === 'S'
      this.vaga.idEmpresa = vaga.data.idEmpresa.idconta
      const reg = /^\d+-/
      this.vaga.logoNome = vaga.data.logo.replace(reg, '')
      this.vaga.bannerNome = vaga.data.banner.replace(reg, '')
      this.vaga.salario = parseFloat(this.vaga.salario)
      this.vaga.salario = this.converterParaMoeda(this.vaga.salario)
      this.cidadeSelecionadasText = this.vaga.cidade
    }
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
    this.validateEmail();
    if (this.emailInvalid) {
      this.showMessage("Por favor, insira um e-mail válido para recebimento de currículos");
      return;
    }
    
    if(await this.verifyData())
      return
    let vagaSalario = this.converterParaNumero(this.vaga.salario)
    if (this.vaga.pcd == 1)
      this.vaga.pcd = true
    else
      this.vaga.pcd = false
    if (this.userId && this.userType) {
      if (this.userType == 'E')
        this.vaga.idEmpresa = this.userId
      await this.vagaService.update({
        "idVaga": +this.idVaga,
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
        "idArea": this.vaga.idArea.id ?? this.vaga.idArea.idArea ?? this.vaga.idArea,
        "emailCurriculo": this.vaga.emailCurriculo,
        "idEmpresa": +this.vaga.idEmpresa,
        "ocultarNome": this.vaga.ocultarNome === true ? 'S' : 'N'
      }, this.idVaga).then(response => {
        if (response.status == 200) {
          const imgResponse = this.vagaService.sendLogoAndBanner(this.idVaga, this.vaga.logo, this.vaga.banner)
          this.showMessage("Vaga atualizada com sucesso!")
          this.navController.navigateRoot('minhas-vagas')
        }
      })
    }
  }

  async verifyData(){
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
      this.showMessage("Por favor, preencha o campo Data de encerramento.");
      return true;
    } else {
      const dataLimite = new Date(this.vaga.dataLimite);
      if (isNaN(dataLimite.getTime()) || dataLimite < amanha) {
        this.showMessage("Por favor, insira uma data de encerramento que esteja no futuro.");
        return true;
      }
    }
    if (this.vaga.titulo == null || this.vaga.titulo.trim() == "") {
      this.showMessage("Por favor, preencha o campo Título.");
      return true;
    }
    if (this.vaga.salario == null) {
      this.showMessage("Por favor, preencha o campo Salário.");
      return true;
    }
    if (this.vaga.descricao == null || this.vaga.descricao.trim() == "") {
      this.showMessage("Por favor, preencha o campo Detalhes.");
      return true;
    }
    if (this.vaga.tipo == null) {
      this.showMessage("Por favor, preencha o campo Turno.");
      return true;
    }
    if (this.vaga.regime == null) {
      this.showMessage("Por favor, preencha o campo Regime.");
      return true;
    }
    if (this.vaga.modalidade == null) {
      this.showMessage("Por favor, preencha o campo Modalidade.");
      return true;
    }
    if (this.vaga.idArea == null) {
      this.showMessage("Por favor, preencha o campo Área.");
      return true;
    }
    if (this.vaga.cidade == null) {
      this.showMessage("Por favor, preencha o campo Cidade.");
      return true;
    }
    if (this.vaga.idEmpresa == null && this.userType != "E") {
      this.showMessage("Por favor, preencha o campo Empresa.");
      return true;
    }
    if (this.vaga.nivelInstrucao == null) {
      this.showMessage("Por favor, preencha o campo Nível de instrução.");
      return true;
    }
    if (this.vaga.emailCurriculo == null || this.vaga.emailCurriculo.trim() == "") {
      this.showMessage("Por favor, preencha o campo Email de currículos.");
      return true;
    }
    return false;
  }

  onLogoSelected(e: any) {
    this.vaga.logo = e.target.files[0]
  }

  onBannerSelected(e: any) {
    this.vaga.banner = e.target.files[0]
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
                const newOption = { idArea: response.data.id, nome: data.outraArea };
                this.areas.push(newOption);
                // Atualiza as áreas selecionadas
                this.vaga.idArea = newOption.idArea
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

  converterParaNumero(valorString: any){
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