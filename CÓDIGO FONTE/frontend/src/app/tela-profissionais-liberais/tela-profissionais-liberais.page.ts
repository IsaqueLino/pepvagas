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
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-tela-profissionais-liberais',
  templateUrl: './tela-profissionais-liberais.page.html',
  styleUrls: ['./tela-profissionais-liberais.page.scss'],
})
export class TelaProfissionaisLiberaisPage implements OnInit {

  public listaProfissionais: any[] = [];
  public login: any = {}
  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  public dataExpira: any;
  public salario: any;
  public selectedFile: File | null = null;
  public selectedOption: any = '';
  public servicos: any = [];
  public selectedTipoId: any = null;
  public nenhumProf = false;

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

    this.getTiposServicos();
    this.getUser();
    this.carregarLista();

    /*const id = localStorage.getItem('idProfissional');
    if (!id) {
      this.showMessage("Erro ao encontrar o profissional", 'danger');
      this.navigationController.navigateBack('/');
      return;
    }

    this.id = id;
    this.getProfissional(id);*/


    if (!this.authService.getJwt())
      this.isLogged = false;
    else {
      this.isLogged = true;
    }


  }


  async getTiposServicos() {
    try {
      this.servicos = await this.tipoService.buscarTodosServicos();
      this.servicos.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar os tipos de serviços:', error);
      this.showMessage('Erro ao carregar os tipos de serviços.');
    }
  }

  async onTipoChange(event: any) {
    this.selectedTipoId = event.detail.value;
    this.tipoService.buscarProfissionais(this.selectedTipoId).then(profissionais => {
      this.listaProfissionais = profissionais;
      if (this.listaProfissionais.length > 0) {
        this.getTiposServicosDoProfissional();
      }
    })
  }


  async getTiposServicosDoProfissional() {
    for (const prof of this.listaProfissionais) {
      try {
        const tipo = await this.profissionalLiberalService.buscarTipoPorProfissional(prof.idconta);
  
        if (prof.telefone)
          prof.telefone = await this.formatNumber("+55" + prof.telefone);
        if (prof.nomeSocial)
          prof.nome = prof.nomeSocial;
  
        if (!Array.isArray(tipo) || tipo.length === 0) {
          prof.servicos = "Tipos de Serviços não informados";
        } else {
          const nomesAreas = tipo.map((tipoServico: any) => tipoServico.nome);
          prof.servicos = nomesAreas.join(", ");
        }
  
      } catch (err) {
        prof.servicos = "Tipos de Serviços não encontrados";
      }
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

  async carregarLista() {
    try {
      // Resetar o tipo selecionado
      this.selectedTipoId = null;
      
      // Resetar o valor do select (opcional, mas recomendado)
      const selectElement = document.getElementById('tipo') as HTMLIonSelectElement;
      if (selectElement) {
        selectElement.value = null;
      }
  
      // Carregar a lista completa
      this.listaProfissionais = await this.profissionalLiberalService.buscarTodosAtivos();
  
      if(this.listaProfissionais.length > 0) {
        this.getTiposServicosDoProfissional();
      }
  
    } catch (error) {
      console.error('Erro ao carregar a lista de profissionais liberais:', error);
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

  async goBack() {
    this.navigationController.navigateBack('/home');
  }

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top'
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
function getCountryCode(arg0: number): string {
  throw new Error('Function not implemented.');
}

