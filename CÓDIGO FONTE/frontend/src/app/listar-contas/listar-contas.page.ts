import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, IonModal, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { EmpresaService } from '../services/empresa.service';
import { RepresentanteService } from '../services/representante.service';
import { ProfissionalLiberalService } from '../services/profissional-liberal.service';
import { MembroService } from '../services/membro.service';
import { CandidatoService } from '../services/candidato.service';

@Component({
  selector: 'app-listar-contas',
  templateUrl: './listar-contas.page.html',
  styleUrls: ['./listar-contas.page.scss'],
})
export class ListarContasPage implements OnInit {
  public listaConta: any[] = []; // Contém nome, email, tipo, idConta
  public selectedIdConta: number | null = null;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  constructor(
    private toastController: ToastController,
    private contaServico: AuthService,
    private alertController: AlertController,
    private navigationController: NavController,
    private empresaServico: EmpresaService,
    private representanteServico: RepresentanteService,
    private profissionalLiberalServico: ProfissionalLiberalService,
    private membroServico: MembroService,
    private candidatoServico: CandidatoService
  ) {
    if (this.contaServico.getJwt() == null) {
      this.navigationController.navigateRoot('login');
    }
  }

  ngOnInit() {
    this.carregarLista();
  }

  message = ''

  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  async carregarLista() {
    try {
      const response = await this.contaServico.listAcount();
      // Filtra contas com tipo 'A' (admins)
      const contas = response.data.filter((conta: any) => conta.tipo !== 'A');
      // Constroi listaConta com nome, email, tipo, idConta
      this.listaConta = await Promise.all(
        contas.map(async (conta: any) => {
          const nome = await this.getNomeByTipo(conta.tipo, conta.idConta);
          return {
            idConta: conta.idConta,
            nome,
            email: conta.email,
            tipo: conta.tipo
          };
        })
      );
    } catch (error) {
      console.error('Erro ao carregar a lista de contas:', error);
      this.exibirMensagem('Erro ao carregar a lista de contas. Tente novamente.');
    }
  }

  async getNomeByTipo(tipo: string, idConta: number): Promise<string> {
    try {
      const idString = String(idConta);
      switch (tipo) {
        case 'E':
          const empresa = await this.empresaServico.getEmpresa(idString);
          return empresa.nomeEmpresa || 'Sem Nome';
        case 'R':
          const representante = await this.representanteServico.getRepresentante(idString);
          return representante.nome || 'Sem Nome';
        case 'L':
          const profissional = await this.profissionalLiberalServico.getProfissionalLiberal(idString);
          return profissional.nome || 'Sem Nome';
        case 'M':
          const membro = await this.membroServico.getMembroEquipe(idString);
          return membro.nome || 'Sem Nome';
        case 'C':
          const candidato = await this.candidatoServico.getCandidato(idString);
          return candidato.nome || 'Sem Nome';
        default:
          return 'Sem Nome';
      }
    } catch (error) {
      console.error(`Erro ao buscar nome para conta tipo ${tipo}:`, error);
      return 'Sem Nome';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'E':
        return 'Empresa';
      case 'R':
        return 'Representante';
      case 'L':
        return 'Prof. Liberal';
      case 'M':
        return 'Mem. Equipe';
      case 'C':
        return 'Candidato';
      default:
        return tipo; // Não deve ocorrer, pois 'A' é filtrado
    }
  }

  get paginatedListaConta() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.listaConta.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.listaConta.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onRowClick(idConta: number) {
    this.selectedIdConta = idConta;
  }

  async excluir() {
    if (this.selectedIdConta == null) {
      this.exibirMensagem('Selecione uma conta.');
      return;
    }
    const idString = String(this.selectedIdConta);
    const contaSelecionada = this.listaConta.find((c) => c.idConta === this.selectedIdConta);

    try {
      await this.contaServico.deleteAccount(idString);

      switch (contaSelecionada.tipo) {
        case 'E':
          await this.empresaServico.desativarEmpresa(idString);
          break;
        case 'R':
          await this.representanteServico.desativarRepresentante(idString);
          break;
        case 'L':
          await this.profissionalLiberalServico.desativarProfissional(idString);
          break;
        case 'M':
          await this.membroServico.desativarMembro(idString);
          break;
        case 'C':
          await this.candidatoServico.desativarCandidato(idString);
          break;
      }

      await this.carregarLista(); // Recarrega a lista para refletir a exclusão
      this.selectedIdConta = null;

      const toast = await this.toastController.create({
        message: 'Conta excluída com sucesso!',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    } catch (error) {
      console.error('Erro ao excluir conta e dados vinculados:', error);
      this.exibirMensagem('Erro ao excluir a conta. Tente novamente.');
    }
  }

  async confirmarExclusao() {
    if (this.selectedIdConta == null) {
      this.exibirMensagem('Selecione uma conta.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja excluir a conta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluir();
          },
        },
      ],
    });

    await alert.present();
  }

  async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  async cancelar() {
    this.modal2.dismiss(null, 'cancel');
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}