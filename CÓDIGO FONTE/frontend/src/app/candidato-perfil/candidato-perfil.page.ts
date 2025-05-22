import { Component, OnInit, ViewChild } from '@angular/core';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonModal, NavController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CandidatoService } from '../services/candidato.service';
import { AreaService } from '../services/area.service';
import { CidadeService } from '../services/cidade.service';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';

interface Area {
  idArea: number;
  nome: string;
  deletedAt: string | null; // ou o tipo correto para deletedAt, se aplicável
}
@Component({
  selector: 'app-candidato-perfil',
  templateUrl: './candidato-perfil.page.html',
  styleUrls: ['./candidato-perfil.page.scss'],
})
export class CandidatoPerfilPage implements OnInit {
  public selectedFile: File | null = null;
  public conta: any = {}
  public candidato: any = {}
  public candidatoAreas: any = []
  public candidatoAlterado: any = {}
  public candidatoAlteradoAreas: any = []
  public isDarkTheme: boolean = false
  public senhaAtual = ''
  public novaSenha = ''
  public confirmarNovaSenha = ''
  public opcoes: any = []
  public user: any = {}
  public userType: string = ''
  public isLogged: boolean = false
  public listaCidades: any = []
  public cidadesFiltro: any = []
  public cidadesSelecionadas: string[] = []
  public cidadesSelecionadasText: any
  public cidadeProcurada: any = ''

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement()

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly cpfMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  }

  readonly moneyMask = maskitoNumberOptionsGenerator({
    decimalZeroPadding: true,
    precision: 2,
    decimalSeparator: ',',
    thousandSeparator: '.',
    min: 0,
    prefix: 'R$',
  });

  constructor(private authService: AuthService,
    private navigationController: NavController,
    private candidatoService: CandidatoService,
    private toastController: ToastController,
    private areaService: AreaService,
    private cidadeService: CidadeService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    if (this.authService.getJwt() == null)
      this.navigationController.navigateRoot('login')

    this.getUser()

    try {
      this.conta = await this.authService.getContaDetails()
    } catch (error) {
      console.error('Erro ao obter detalhes da conta:', error)
    }

    try {

      this.candidato = await this.candidatoService.getCandidato(this.conta.idConta)

      this.candidato.pcd = this.pcdForString(this.candidato.pcd)
      this.candidato.cpf = this.formatCpf(this.candidato.cpf)
      this.candidato.telefone = this.formatTelefone(this.candidato.telefone)
      if (this.candidato.pretensaoSalarial != null) {
        this.candidato.pretensaoSalarial = this.converterParaMoeda(this.candidato.pretensaoSalarial)
      }
      if (this.candidato.cidade != null) {
        this.cidadesSelecionadas = this.convertStringToArray(this.candidato.cidade)
        this.cidadesSelecionadasText = this.candidato.cidade
      }

      this.obterOpcoes()


      try {
        this.candidatoAreas = await this.candidatoService.buscarAreasPorCandidatoId(this.conta.idConta);
      } catch (error) {
        console.error("Erro ao carregas as áreas de interesse do candidato")
      }

      this.candidatoAlterado = Object.assign({}, this.candidato)
      this.candidatoAlteradoAreas = [...this.opcoes];

      this.candidatoAlteradoAreas = this.candidatoAlteradoAreas.filter((area: Area) => {

        return this.candidatoAreas.some((candidatoArea: Area) => candidatoArea.idArea === area.idArea);
      });

    } catch (error) {
      console.error('Erro ao obter detalhes do candidato:', error)
    }
    this.carregarCidades()
  }

  @ViewChild('modal1', { static: true }) modal!: IonModal;
  @ViewChild('modal2', { static: true }) modal2!: IonModal;
  @ViewChild('cidadesPopover') cidadesPopover: any;
  isCidadesPopoverOpen: boolean = false;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'

  cancel() {
    this.candidatoAlterado = Object.assign({}, this.candidato)
    this.selectedFile = null
    this.modal.dismiss(null, 'cancel');

    this.candidatoAlteradoAreas = [...this.opcoes];
    this.candidatoAlteradoAreas = this.candidatoAlteradoAreas.filter((area: Area) => {
      return this.candidatoAreas.some((candidatoArea: Area) => candidatoArea.idArea === area.idArea);
    });

    if (this.candidatoAlterado.cidade != null) {
      this.candidatoAlterado.cidade = this.convertStringToArray(this.candidatoAlterado.cidade);
    }

    if (this.candidato.cidade != null) {
      this.cidadesSelecionadas = this.convertStringToArray(this.candidato.cidade)
      this.cidadesSelecionadasText = this.candidato.cidade
    }
  }

  confirm() {
    this.alterarCandidato()
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancelPassword() {
    this.modal2.dismiss(null, 'cancel');
    this.senhaAtual = ''
    this.novaSenha = ''
    this.confirmarNovaSenha = ''
  }

  confirmPassword() {
    this.updatePassword()
    // this.modal2.dismiss(this.candidato.nome, 'confirm')
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]

    if (file != null) {
      this.verifyFileSize(file) ? this.exibirMensagem("Tamanho do arquivo deve ser de até 8MB") : this.selectedFile = file
    }
  }

  public actionSheetButtons = [
    {
      text: 'Prosseguir',
      role: 'destructive',
      handler: () => {
        this.deactivateAccount(this.conta.idConta);
      }
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  redirect(ref: string) {
    this.navigationController.navigateForward(ref)
  }

  logout() {
    this.authService.logout()
    this.navigationController.navigateForward('login')
  }

  mapGenero(genero: string): string {
    switch (genero) {
      case 'm':
        return 'Masculino'
      case 'f':
        return 'Feminino'
      case 'n':
        return 'Não informar'
      default:
        return 'Gênero não especificado'
    }
  }

  mapPcd(pcd: string): string {
    if (pcd === '1') {
      return 'Sim';
    } else if (pcd === '0') {
      return 'Não';
    } else {
      return 'Valor inválido';
    }
  }

  pcdForString(pcd: boolean): string {
    if (pcd) {
      return '1'
    } else {
      return '0'
    }
  }

  formatCpf(cpf: string): string {
    if (cpf && cpf.length === 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      return cpf;
    }
  }

  formatTelefone(telefone: string): string {
    if (telefone && telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else {
      return telefone;
    }
  }

  async deactivateAccount(id: string): Promise<void> {

    try {
      const responseCandidato = await this.candidatoService.desativarCandidato(id);

      const mensagem = responseCandidato?.message || responseCandidato?.data?.message;

      if (mensagem) {
        if (mensagem === "Candidato desativado com sucesso!") {
          const responseConta = await this.authService.deleteAccount(id);

          if (responseConta?.data?.message) {
            await this.exibirMensagem("Conta desativada com sucesso!");
            this.logout();
          } else {
            console.error('Erro ao desativar a conta. Resposta da API de conta:', responseConta);
            this.exibirMensagem(responseConta?.data?.message || 'Erro ao desativar a conta. Tente novamente mais tarde!');
          }
        } else {
          console.error('Erro ao desativar o candidato:', mensagem);
          this.exibirMensagem(mensagem);
        }
      } else {
        console.error('Resposta inválida ou sem mensagem da API do candidato.');
        this.exibirMensagem('Erro ao desativar o candidato. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao desativar o candidato:', error);
      this.exibirMensagem('Ocorreu um erro ao tentar desativar o candidato. Tente novamente.');
    }
  }

  async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async alterarCandidato() {
    const dataNascimentoString = this.candidatoAlterado.dataNascimento
    const dataNascimento = new Date(dataNascimentoString)
    const dataAtual = new Date()

    const idadeEmMilissegundos = dataAtual.getTime() - dataNascimento.getTime();
    const idadeEmAnos = idadeEmMilissegundos / (1000 * 60 * 60 * 24 * 365);

    if (this.candidatoAlterado.nome == '') {
      this.exibirMensagem("O seu nome não pode estar vazio.")
    }
    else if (this.candidatoAlterado.cpf != this.candidato.cpf) {
      this.exibirMensagem("Você não pode mudar de CPF")
    }
    else if (dataNascimento == null || this.candidatoAlterado.dataNascimento == '') {
      this.exibirMensagem("Insira uma Data de Nascimento")
    }
    else if (dataNascimento.getTime() > dataAtual.getTime()) {
      this.exibirMensagem("Data inválida")
    }
    else if (idadeEmAnos < 16) {
      this.exibirMensagem("Você deve ter pelo menos 16 anos.");
    }
    else if (this.candidatoAlterado.telefone !== null && this.candidatoAlterado.telefone.length < 15) {
      this.exibirMensagem("Complete o número de telefone")
    }
    else {
      try {

        let pretensaoSalarial: any
        if (this.candidatoAlterado.pretensaoSalarial != null) {
          pretensaoSalarial = this.converterParaNumero(this.candidatoAlterado.pretensaoSalarial);
        }

        const response = await this.candidatoService.updateCandidato(
          this.candidatoAlterado.idconta,
          this.candidatoAlterado.nome,
          this.candidatoAlterado.nomeSocial,
          this.candidatoAlterado.genero,
          this.candidatoAlterado.cpf,
          this.candidatoAlterado.dataNascimento,
          this.candidatoAlterado.pcd,
          this.candidatoAlterado.disponibilidade,
          this.cidadesSelecionadasText,
          this.candidatoAlterado.tipoVaga,
          this.candidatoAlterado.nivelInstrucao,
          this.candidatoAlterado.cnh,
          pretensaoSalarial,
          this.candidatoAlterado.telefone
        );

        if (response.status === 200) {
          const resposta = this.atualizarAreasDeInteresseCandidato(this.conta.idConta, this.candidatoAlteradoAreas)
          this.candidatoAlteradoAreas = [...this.opcoes];
          this.candidatoAlteradoAreas = this.candidatoAlteradoAreas.filter((area: Area) => {
            return this.candidatoAreas.some((candidatoArea: Area) => candidatoArea.idArea === area.idArea);
          });

          if ((await resposta).status === 200) {
            this.modal.dismiss(this.candidato.nome, 'confirm');
            this.ngOnInit()
            this.exibirMensagem("Informações alteradas com sucesso!")
          }

        } else {
          console.error('Erro ao alterar candidato:', response.data);
          this.exibirMensagem('Erro ao alterar candidato. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao alterar candidato:', error);
      }

      try {
        if (this.selectedFile !== null) {
          const resposta = await this.candidatoService.uploadFile(this.conta.idConta, this.selectedFile)
        }

      } catch (error) {
        console.log("erro" + error)
      }
    }

  }

  async removerCurriculo() {
    const response = await this.candidatoService.deleteFile(localStorage.getItem('user'))
    this.exibirMensagem(response.message)
  }

  async abrirCurriculo() {
    const response = await this.candidatoService.getFile(localStorage.getItem('user'));

    // Se for erro tratado no backend
    if (response.erro) {
      this.exibirMensagem(response.message);
      return;
    }

    const blob = response.data;
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }

  async updatePassword() {
    try {
      if (this.novaSenha.length < 4) {
        this.exibirMensagem("Nova senha deve ter no mínimo 4 caracteres.")
      }
      else if (this.novaSenha != this.confirmarNovaSenha) {
        this.exibirMensagem("A nova senha e sua confirmação não coincidem.")
      }
      else {
        const response = await this.authService.updatePassword(this.conta.idConta, this.senhaAtual, this.novaSenha, this.confirmarNovaSenha);
        if (response.status === 200) {
          this.exibirMensagem("Senha atualizada com sucesso!");
          this.modal2.dismiss(null, 'confirm');
          this.senhaAtual = ''
          this.novaSenha = ''
          this.confirmarNovaSenha = ''
        } else {
          this.exibirMensagem("Senha Atual incorreta");
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      this.exibirMensagem('Senha Atual incorreta');
    }
  }

  async obterOpcoes() {
    try {
      const response = await this.areaService.getAreas();
      this.opcoes = response; // Armazena a resposta na variável global 'opcoes'
      this.opcoes.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
    }
  }

  formatAreasInteresse(areasInteresse: any[]): string {
    if (!areasInteresse || areasInteresse.length === 0) {
      return "";
    } else {
      const nomesAreas = areasInteresse.map(area => area.nome);
      return nomesAreas.join(", ");
    }
  }

  async atualizarAreasDeInteresseCandidato(idconta: string, novasAreas: string[]) {
    try {
      const response = await this.candidatoService.updateAreasDeInteresse(idconta, novasAreas);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar áreas de interesse do candidato:', error);
      throw error;
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
          break;
        case "C":
          this.user = await this.candidatoService.getCandidato(userId)
          break;
        case "E":
          break;
        case "M":
          break;
        case "R":
          break;
        case "L":
          break;
      }


      // const user = await this.candidatoService.getCandidato(userId)
      // this.user = user
      this.isLogged = true
    }
  }

  formatPretensaoSalarial(valor: number): string {
    if (valor == null) {
      return '';
    }

    const valorFormatado = valor.toFixed(2).replace('.', ',');

    return `R$ ${valorFormatado}`;
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
              // Remover a opção 'outro' das áreas selecionadas
              this.candidatoAlteradoAreas = this.candidatoAlteradoAreas.filter((value: string) => value !== 'outro');
            },
          },
          {
            text: 'OK',
            handler: async (data) => {
              if (data.outraArea) {
                // Chama o serviço para cadastrar a nova área
                await this.areaService.cadastrarArea(data.outraArea);
                // Adiciona a nova área às opções
                const newOption = { id: data.outraArea, nome: data.outraArea };
                this.opcoes.push(newOption);
                // Atualiza as áreas selecionadas
                this.candidatoAlteradoAreas = [
                  ...this.candidatoAlteradoAreas.filter((value: string) => value !== 'outro'),
                  newOption
                ];
                // Exibe a mensagem de sucesso
                this.exibirMensagem('Nova área de interesse adicionada com sucesso!');
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  convertStringToArray(cidades: string): string[] {
    // Dividindo a string por vírgula e removendo espaços extras, se houver
    return cidades.split(',').map(cidade => cidade.trim());
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

  converterParaMoeda(valorNumerico: any) {
    if (isNaN(valorNumerico)) {
      throw new Error(`Valor numerico não pôde ser convertido para um número`);
    }

    const valorFormatado = valorNumerico.toFixed(2);
    const partes = valorFormatado.split('.');

    let parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    let resultado = `R$ ${parteInteira},${partes[1]}`;

    return resultado;
  }

  dismissCidadesPopover() {
    this.cidadesSelecionadasText = this.cidadesSelecionadas.toString()
    this.isCidadesPopoverOpen = false
  }

  public handleCidadesFiltro(e: any) {
    const query = e.target.value.toLowerCase();

    if (query == '') {
      this.cidadesFiltro = [...this.listaCidades]
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

    if (this.cidadesSelecionadas[0] == '') {
      this.cidadesSelecionadas.slice(0, 1)
    }

  }

  public removeCidade(cidade: string) {
    const index = this.cidadesSelecionadas.indexOf(cidade)
    if (index > -1) {
      this.cidadesSelecionadas.splice(index, 1)
    }

  }

  async carregarCidades() {
    this.cidadeService.getCidades().subscribe((data: any[]) => {
      this.listaCidades = data.map((cidade: any) => cidade.nome);
      this.cidadesFiltro = [...this.listaCidades]
    });
  }

  public verifyFileSize(file: any) {
    const size = 8 * 1024 * 1024

    if (file.size > size) {
      return true
    }
    return false
  }

  async confirmarRemocaoCurriculo() {

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja remover seu currículo da plataforma?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Remover',
          handler: () => {
            this.removerCurriculo();
          },
        },
      ],
    });

    await alert.present();
  }

}
