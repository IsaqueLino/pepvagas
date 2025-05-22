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
      console.log(data)
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
    console.log(this.empresas)
  }

  async obterVaga(){
    if(this.idVaga){
      const vaga = await this.vagaService.getVaga(this.idVaga)
      this.vaga = vaga.data

      console.log("AREA " + JSON.stringify(vaga.data.idArea))

      this.vaga.idArea = vaga.data.idArea.idArea
      this.vaga.pcd = (vaga.data.pcd == true) ? "1" : "0"

      this.vaga.idEmpresa = vaga.data.idEmpresa.idconta

      const reg = /^\d+-/

      this.vaga.logoNome = vaga.data.logo.replace(reg, '')
      this.vaga.bannerNome = vaga.data.banner.replace(reg, '')

      this.vaga.salario = parseFloat(this.vaga.salario)
      console.log(typeof this.vaga.salario)
      console.log(this.vaga.salario)
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

    if(this.vaga.salario == 'R$' || this.vaga.salario == ''){
      this.showMessage("Atribua um salário para a vaga")
      return
    }

    let vagaSalario = this.converterParaNumero(this.vaga.salario)

    if(await this.verifyData())
      return

    if (this.vaga.pcd == 1)
      this.vaga.pcd = true
    else
      this.vaga.pcd = false

    if (this.userId && this.userType) {

      if (this.userType == 'E')
        this.vaga.idEmpresa = this.userId

      console.log(this.vaga.idArea)


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
        "idEmpresa": +this.vaga.idEmpresa
      }, this.idVaga).then(response => {
        if (response.status == 200) {

          const imgResponse = this.vagaService.sendLogoAndBanner(this.idVaga, this.vaga.logo, this.vaga.banner)

          this.showMessage("Vaga atualizada com sucesso.")
          this.navController.navigateRoot('minhas-vagas')
        }
      })
    }
  }

  async verifyData(){
    if(this.vaga.titulo == null || this.vaga.titulo.trim() == ""){
      this.showMessage("Preencha o título da vaga.")
    }else if(this.vaga.salario == null){
      this.showMessage("Preencha o salário da vaga.")
    }else if(this.vaga.descricao == null || this.vaga.descricao.trim() == ""){
      this.showMessage("Preencha os detalhes da vaga.")
    }else if (this.vaga.tipo == null){
      this.showMessage("Preencha o turno da vaga.")
    }else if (this.vaga.regime == null){
      this.showMessage("Preencha o regime da vaga.")
    }else if (this.vaga.modalidade == null){
      this.showMessage("Preencha a modalidade da vaga.")
    }else if (this.vaga.idArea == null){
      this.showMessage("Preencha a area da vaga.")
    }else if (this.vaga.cidade == null){
      this.showMessage("Preencha a cidade da vaga.")
    }else if (this.vaga.idEmpresa == null && this.userType != "E"){
      this.showMessage("Preencha a empresa da vaga.")
    }else if (this.vaga.nivelInstrucao == null){
      this.showMessage("Preencha o nível de instrução da vaga.")
    }else if (this.vaga.dataLimite == null){
      this.showMessage("Preencha a data limite da vaga.")
    }else if (this.vaga.emailCurriculo == null){
      this.showMessage("Preencha o email de currículos da vaga.")
    }else{
      return false
    }
    return true
  }

  onLogoSelected(e: any) {
    this.vaga.logo = e.target.files[0]
    console.log(this.vaga.logo)
  }

  onBannerSelected(e: any) {
    this.vaga.banner = e.target.files[0]
    console.log(this.vaga.logo)
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

                console.log(this.vaga.idArea)
                // Exibe a mensagem de sucesso
                this.showMessage('Nova área de interesse adicionada com sucesso.');
              }
            },
          },
        ],
      });
  
      await alert.present();
    }

    console.log(event.detail.value)
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
