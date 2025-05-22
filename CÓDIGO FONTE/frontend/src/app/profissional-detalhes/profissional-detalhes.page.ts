import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { CandidatoService } from '../services/candidato.service';
import { VagaService } from '../services/vaga.service';
import { AdministradorService } from '../services/administrador.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { EmpresaService } from '../services/empresa.service';
import { RepresentanteService } from '../services/representante.service';
import { MembroService } from '../services/membro.service';
import { ProfissionalLiberalService } from '../services/profissional-liberal.service';
import { TipoServicoService } from '../services/tipo-servico.service';

@Component({
  selector: 'app-profissional-detalhes',
  templateUrl: './profissional-detalhes.page.html',
  styleUrls: ['./profissional-detalhes.page.scss'],
})
export class ProfissionalDetalhesPage implements OnInit {

  public login: any = {}
  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  public prof: any;
  private id: string = '';
  public dataExpira: any;
  public salario: any;
  public selectedFile: File | null = null;
  public selectedOption: any = '';
  public servicos: any = [];

  constructor(
    private authService: AuthService,
    private navigationController: NavController,
    private toastController: ToastController,
    private candidatoService: CandidatoService,
    private vagaService: VagaService,
    private adminService: AdministradorService,
    private empresaService: EmpresaService,
    private representanteService: RepresentanteService,
    private equipeService: MembroService,
    private profissionalLiberalService: ProfissionalLiberalService,
    private tipoService: TipoServicoService
  ) {
    this.getUser()
  }

  async ngOnInit() {
    this.checkTheme()

    this.getUser();

    const id = localStorage.getItem('idProfissional');
    if (!id) {
      this.showMessage("Erro ao encontrar o profissional", 'danger');
      this.navigationController.navigateBack('/');
      return;
    }

    this.id = id;
    this.getProfissional(id);


    if (!this.authService.getJwt())
      this.isLogged = false;
    else {
      this.isLogged = true;
    }
  }


  async formatNumber(number: string) {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4}|\d{5})(\d{4})$/);
    if (match) {
      return ['(', match[2], ')', match[3], '-', match[4]].join('')
    }
    return '';
  }

  async getTiposServicos() {
    const tipo = await this.profissionalLiberalService.buscarTipoPorProfissional(this.prof.idconta);

    if (!Array.isArray(tipo) || tipo.length === 0) {
      this.servicos = "Tipos de Serviços não informados";
    } else {
      const nomesAreas = tipo.map(tipoServico => tipoServico.nome);
      this.servicos = nomesAreas.join(", ");
    }
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
          this.user = await this.empresaService.getEmpresa(userId)
          break;
        case "M":
          this.user = await this.equipeService.getMembroEquipe(userId)
          break;
        case "R":
          this.user = await this.representanteService.getRepresentante(userId)
          break;
        case "L":
          this.user = await this.profissionalLiberalService.buscarProfissional(userId)
          break;
      }


      // const user = await this.candidatoService.getCandidato(userId)
      // this.user = user
      this.isLogged = true
    }
  }

  async getProfissional(id: string) {
    const response = await this.profissionalLiberalService.buscarProfissional(id);
    this.prof = response;
    this.prof.telefone = await this.formatNumber("+55"+this.prof.telefone);

    this.getTiposServicos();

  }

  async goBack() {
    this.navigationController.navigateBack('/listar-profissionais-liberais');
  }

  async showMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color
    })

    toast.present()
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
    }
  }


}
