import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ProfissionalLiberalService } from '../services/profissional-liberal.service';
import { CandidatoService } from '../services/candidato.service';
import { VagaService } from '../services/vaga.service';
import { AdministradorService } from '../services/administrador.service';
import { EmpresaService } from '../services/empresa.service';
import { RepresentanteService } from '../services/representante.service';
import { MembroService } from '../services/membro.service';

@Component({
  selector: 'app-listar-profissionais-liberais',
  templateUrl: './listar-profissionais-liberais.page.html',
  styleUrls: ['./listar-profissionais-liberais.page.scss'],
})
export class ListarProfissionaisLiberaisPage implements OnInit {

  public listaProfissionais: any[] = [];
  public selectedIdconta: number | null = null;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false;
  public isSelected: boolean = false;

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
    private profissionalLiberalService: ProfissionalLiberalService
  ) {
    if(this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')
  }

  ngOnInit() {
    this.carregarLista();
    this.getUser();
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
  onRowClick(idConta: number) {
    this.selectedIdconta = idConta;
    this.isSelected = true;
  }

  async carregarLista() {
    try {
      this.listaProfissionais = await this.profissionalLiberalService.buscarTodos();
    } catch (error) {
      console.error('Erro ao carregar a lista de profissionais liberais:', error);
    }
  }

  get paginatedListaProfissionaisLiberais() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.listaProfissionais.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.listaProfissionais.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  async verDetalhes() {
    if (this.selectedIdconta == null) {
      const toast = await this.toastController.create({
        message: 'Deve ser selecionado um profissional para ver os detalhes',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      return;
    }

    localStorage.setItem('idProfissional',this.selectedIdconta.toString());

    let idString: string = String(this.selectedIdconta);

  }
}
