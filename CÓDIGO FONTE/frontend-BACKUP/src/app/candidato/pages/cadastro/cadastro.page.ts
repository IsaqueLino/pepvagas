import {Component, OnInit} from '@angular/core';
import {CandidatoData} from "../../candidatoData";
import {Regime} from "../../../../../../shared/enums/Regime";
import {AlertController, NavController, Platform, PopoverController, ToastController} from "@ionic/angular";
import {Modalidade} from "../../../../../../shared/enums/Modalidade";
import {api} from "../../../services/axios";
import {PopoverSelectComponent} from "./popover-select/popover-select.component";
import {TipoVaga} from "../../../../../../shared/enums/TipoVaga";
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";
import {ActivatedRoute} from "@angular/router";
import {MaskService} from 'src/app/services/mask.service';
import {AxiosError} from "axios";
import {ConsultCepService} from "../../../services/consult.cep";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  modalidades = Object.values(Modalidade);

  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG',
    'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  ceps = [{
    cep: 0,
    cidade: '',
    uf: '',
    logradouro: '',
  }];

  cadastrado: boolean = false;
  small = true;
  big = true;
  listaAreas = [];
  quantidade = 1;
  contato: string = '';
  tipoContato: string = '';

  posGraduacao = {
    especializacao: false,
    mestrado: false,
    doutorado: false,
    posDoutorado: false
  };

  cadidato: CandidatoData = {

    nome: '',
    nomeSocial: '',
    genero: '',
    cpf: '',
    email: '',
    senha: '',
    tipo: TipoUsuario.CANDIDATO,
    pretensaoSalarial: 0,
    cep: '',
    cidade: '',
    logradouro: '',
    numero: '',
    uf: '',
    complemento: null,
    disponibilidade: '',
    cnh: '',
    nivelInstrucao: '',
    dataNascimento: '',
    regiaoInteresse: false,
    cepInteresse: null,
    cidadeInteresse: null,
    ufInteresse: null,
    modalidadeInteresse: '',
    regimeInteresse: '',
    tipoVagaInteresse: '',
    areas: '',
    curriculo: null,
    pcd: null,
    deletedAt: null,
    contatos: [],

  }

  fileCurriculo: any = null;
  filePcd: any = null;

  areas = []
  areaSelecionada: any;
  checkPcd: boolean = false;
  digitando: any = false;

  public checkSenha: string = '';

  public type: string = 'password';
  public showPass: boolean = false;
  public emailValido: boolean = false;
  public cpfValido: boolean = false;
  public contatoValido: boolean = false
  public cepValido: boolean = false;
  public nomeValido: boolean = false;
  public valorACombinar: boolean = false;
  public todasAreas: boolean = false;

  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };


  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    public platform: Platform,
    public maskService: MaskService,
    private consultCepService: ConsultCepService,
  ) {
  }


  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.cadastrado = params['cadastrado'];
    });

    this.getAreas().then(r => {
    });

    api.get('/list-ceps').then((response) => {
        let data = response.data;

        this.ceps = data.map((cep: any) => {
            return cep;
          }
        );

      }
    ).catch((error) => {
        console.log(error);

      }
    );


    this.platform.ready().then(() => {
      if (this.platform.width() < 768) {
        this.small = false;
        this.big = true;
      } else {
        this.small = true;
        this.big = false;
      }
    });

  }

  async getAreas() {
    api.get('/list-areas').then((response) => {
        let data = response.data;
        this.areas = data.map((area: any) => {
            return area.nome;
          }
        );

      }
    ).catch((error) => {
        console.log(error);
        this.showToast('Erro ao carregar as áreas', 'danger');
      }
    );
  }

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.cadidato.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.cadidato.senha) && /[A-Z]/.test(this.cadidato.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.cadidato.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç,"+-]/.test(this.cadidato.senha);
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  formValido() {

    this.validarPretensaoSalarial();
    if (this.cadidato.nome == '' || this.cadidato.nome == null) {
      this.showAlert('Campo obrigatório', 'Nome não informado');
      return false;
    } else if (this.cadidato.cpf == '' || this.cadidato.cpf == null) {
      this.showAlert('Campo obrigatório', 'CPF não informado');
      return false;
    } else if (this.cadidato.cpf.length < 14 || this.cadidato.cpf.length > 14) {
      this.showAlert('Campo preenchido de forma errada', 'CPF inválido');
      return false;
    } else if (this.validarCpf(this.cadidato.cpf)) {
      this.showAlert('Campo preenchido de forma errada', 'CPF Não existe');
      return false;
    } else if (this.cadidato.email == '' || this.cadidato.email == null) {
      this.showAlert('Campo obrigatório', 'Email não informado');
      return false;
    } else if (!this.cadidato.email.includes('@') && !this.cadidato.email.includes('.')) {
      this.showAlert('Campo preenchido de forma errada', 'Email inválido');
      return false;
    } else if (this.cadidato.senha == '' || this.cadidato.senha == null) {
      this.showAlert('Campo obrigatório', 'Senha não informada');
      return false;
    } else if (!this.senhaValida()) {
      return false;
    } else if (this.cadidato.cep == '' || this.cadidato.cep == null) {
      this.showAlert('Campo obrigatório', 'CEP não informado');
      return false;
    } else if (this.cadidato.cep.toString().length < 8 || this.cadidato.cep.toString().length > 9) {
      this.showAlert('Campo preenchido de forma errada', 'CEP inválido');
      return false;
    } else if (this.cadidato.uf == '' || this.cadidato.uf == null) {
      this.showAlert('Campo obrigatório', 'UF não informada');
      return false;
    } else if (this.cadidato.cidade == '' || this.cadidato.cidade == null) {
      this.showAlert('Campo obrigatório', 'Cidade não informada');
      return false;
    } else if (this.cadidato.logradouro == '' || this.cadidato.logradouro == null) {
      this.showAlert('Campo obrigatório', 'Logradouro não informado');
      return false;
    } else if (this.cadidato.numero == '' || this.cadidato.numero == null) {
      this.showAlert('Campo obrigatório', 'Número não informado');
      return false;
    } else if (this.cadidato.tipoVagaInteresse == '' || this.cadidato.tipoVagaInteresse == null) {
      this.showAlert('Campo obrigatório', 'Tipo de vaga não informado');
      return false;
    } else if (this.cadidato.tipoVagaInteresse.includes('Emprego') && (this.cadidato.regimeInteresse == '' || this.cadidato.regimeInteresse == null)) {
      this.showAlert('Campo obrigatório', 'Regime de trabalho não informado');
      return false;
    } else if (this.cadidato.modalidadeInteresse == '' || this.cadidato.modalidadeInteresse == null) {
      this.showAlert('Campo obrigatório', 'Modalidade de trabalho não informada');
      return false;
    } else if (this.cadidato.nivelInstrucao == '' || this.cadidato.nivelInstrucao == null) {
      this.showAlert('Campo obrigatório', 'Nível de instrução não informado');
      return false;
    } else if (this.cadidato.disponibilidade == '' || this.cadidato.disponibilidade == null) {
      this.showAlert('Campo obrigatório', 'Disponibilidade não informada');
      return false;
    } else if (this.cadidato.cnh == '' || this.cadidato.cnh == null) {
      this.showAlert('Campo obrigatório', 'CNH não informada');
      return false;
    } else if (!this.todasAreas && (this.cadidato.areas == '' || this.cadidato.areas == null)) {
      this.showAlert('Campo obrigatório', 'Área não informada');
      return false;
    } else if (this.cadidato.dataNascimento == '' || this.cadidato.dataNascimento == null) {
      this.showAlert('Campo obrigatório', 'Data de nascimento não informada');
      return false;
    } else if (this.cadidato.dataNascimento.length < 10 || this.cadidato.dataNascimento.length > 10) {
      this.showAlert('Campo preenchido de forma errada', 'Data de nascimento inválida');
      return false;
    } else if (this.cadidato.genero == '' || this.cadidato.genero == null) {
      this.showAlert('Campo obrigatório', 'Gênero não informado');
      return false;
    } else if (this.validarPretensaoSalarial()) {
      return false;
    } else if (this.cadidato.contatos.length == 0) {
      this.showAlert('Campo obrigatório', 'Contato não informado');
      return false;
    } else if (this.fileCurriculo == null) {
      this.showAlert('Campo obrigatório', 'Currículo não informado');
      return false;
    } else if (this.filePcd == null && this.checkPcd) {
      this.showAlert('Campo obrigatório', 'Comprovação de PCD não informada');
      return false;
    } else if (this.cadidato.regiaoInteresse) {
      if (this.cadidato.cepInteresse == null || this.cadidato.cepInteresse == 0) {
        this.showAlert('Campo obrigatório', 'CEP de interesse não informado');
        return false;
      } else if (this.cadidato.ufInteresse == null || this.cadidato.ufInteresse == '') {
        this.showAlert('Campo obrigatório', 'UF de interesse não informada');
        return false;
      } else if (this.cadidato.cidadeInteresse == null || this.cadidato.cidadeInteresse == '') {
        this.showAlert('Campo obrigatório', 'Cidade de interesse não informada');
        return false;
      }

    }

    return true;
  }

  async cadastrarCandidato() {

    if (this.cadidato.nivelInstrucao.includes('superiorC')) {
      console.log(this.posGraduacao)
      if (this.posGraduacao.especializacao) this.cadidato.nivelInstrucao += ' ,especialização, ';
      if (this.posGraduacao.mestrado) this.cadidato.nivelInstrucao += 'mestrado, ';
      if (this.posGraduacao.doutorado) this.cadidato.nivelInstrucao += 'doutorado, ';
      if (this.posGraduacao.posDoutorado) this.cadidato.nivelInstrucao += 'pós-doutorado, ';
    }

    if (this.formValido()) {
      try {

        if (this.cadidato.nivelInstrucao.includes('superiorC')) {
          console.log(this.posGraduacao)
          if (this.posGraduacao.especializacao) this.cadidato.nivelInstrucao += ' ,especialização, ';
          if (this.posGraduacao.mestrado) this.cadidato.nivelInstrucao += 'mestrado, ';
          if (this.posGraduacao.doutorado) this.cadidato.nivelInstrucao += 'doutorado, ';
          if (this.posGraduacao.posDoutorado) this.cadidato.nivelInstrucao += 'pós-doutorado, ';
        }

        const formData = new FormData();

        this.cadidato.cep = this.cadidato.cep.replace(/\D/g, '');
        if (this.cadidato.cepInteresse) this.cadidato.cepInteresse = parseInt(this.cadidato.cepInteresse.toString().replace('-', ''));
        if (this.valorACombinar) {
          this.cadidato.pretensaoSalarial = 0;
        } else {
          this.cadidato.pretensaoSalarial = parseFloat(this.cadidato.pretensaoSalarial.toString().replace(',', '.').replace('R$', ''));
        }
        if (this.todasAreas) {
          this.cadidato.areas = 'Todas';
        }

        // Limpa os campos do cpf
        this.cadidato.cpf = this.cadidato.cpf.replace(/\D/g, '');

        formData.append('curriculo', this.fileCurriculo);
        formData.append('pcd', this.filePcd);
        formData.append('candidato', JSON.stringify(this.cadidato));

        const response = await api.post('/create-candidato', formData);


        const tipoUser = localStorage.getItem('tipoUsuario');

        if (tipoUser != TipoUsuario.CANDIDATO) {
          this.navCtrl.navigateForward('/listar-candidato');
        } else {
          this.navCtrl.navigateForward('/login');
        }

        await this.showToast('Cadastro realizado com sucesso', 'success');

        this.limparCampos();


      } catch (error) {
        // Transforma o cep e o cpf em string e com mascara
        this.cadidato.cep = this.cadidato.cep.toString().substring(0, 5) + '-' + this.cadidato.cep.toString().substring(5, 8);
        this.cadidato.cpf = this.cadidato.cpf.toString().substring(0, 3) + '.' + this.cadidato.cpf.toString().substring(3, 6) + '.' + this.cadidato.cpf.toString().substring(6, 9) + '-' + this.cadidato.cpf.toString().substring(9, 11);
        if (error instanceof AxiosError) {
          this.showToast(error.response?.data.message, 'danger');
        } else {
          this.showToast('Erro ao cadastrar candidato!', 'danger');
        }
      }
    }

  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000, // Duração do toast em milissegundos (2 segundos neste exemplo)
      position: 'top', // Posição do toast na tela (pode ser 'top', 'middle' ou 'bottom')
      color: color, // Cor do toast (pode ser 'success', 'danger', etc.)
    });

    await toast.present();
  }

  onIonChange(event: any, selectName: String) {
    if (selectName === 'regime') {
      this.cadidato.regimeInteresse = event.detail.value;
    } else if (selectName === 'tipoVaga') {
      this.cadidato.tipoVagaInteresse = event.detail.value;
    } else if (selectName === 'modalidade') {
      this.cadidato.modalidadeInteresse = event.detail.value;
    } else if (selectName === 'cnh') {
      this.cadidato.cnh = event.detail.value;
    } else if (selectName === 'genero') {
      this.cadidato.genero = event.detail.value;
    } else if (selectName === 'nivelInstrucao') {
      this.cadidato.nivelInstrucao = event.detail.value;
    } else if (selectName === 'disponibilidade') {
      this.cadidato.disponibilidade = event.detail.value;
    }

  }


  async openPopOver(ev: any) {


    const popover = await this.popoverController.create({
      component: PopoverSelectComponent,
      componentProps: {areas: this.areas, areasSelecionadas: this.listaAreas},
      event: ev,
      translucent: true,
      keyboardClose: true,
      backdropDismiss: true,
      size: 'cover'
    });
    await popover.present();

    const {data} = await popover.onWillDismiss();

    // limpa o popup
    popover.remove();

    this.getAreas().then(r => {
      console.log(this.areas)
    });
    if (data) {
      this.listaAreas = data;
      this.cadidato.areas = '';
      this.listaAreas.forEach((area: any) => {
        this.cadidato.areas += area.nome + ', ';
      });
    }

  }


  check($event: any, tipo: string, valor: string) {

    if (tipo === 'pretensaoSalarial') {
      this.valorACombinar = $event.detail.checked;
      console.log(this.valorACombinar)
    }

    if (tipo === 'areasInteresse') {
      this.todasAreas = $event.detail.checked;
      console.log(this.todasAreas)
    }

    if (tipo === 'modalidade') {
      if ($event.detail.checked) {
        this.cadidato.modalidadeInteresse += valor + ', ';
      } else {
        this.cadidato.modalidadeInteresse = this.cadidato.modalidadeInteresse.replace(valor + ', ', '');
      }
    }

    if (tipo === 'disponibilidade') {
      if ($event.detail.checked) {
        this.cadidato.disponibilidade += valor + ', ';
      } else {
        this.cadidato.disponibilidade = this.cadidato.disponibilidade.replace(valor + ', ', '');
      }
    }
    if (tipo === 'tipoVaga') {
      if ($event.detail.checked) {
        this.cadidato.tipoVagaInteresse += valor + ', ';
        if (valor === 'emprego') this.cadidato.regimeInteresse = '';

      } else {
        this.cadidato.tipoVagaInteresse = this.cadidato.tipoVagaInteresse.replace(valor + ', ', '');
      }
    }

    if (tipo === 'regime') {
      if ($event.detail.checked) {
        this.cadidato.regimeInteresse += valor + ', ';
      } else {
        this.cadidato.regimeInteresse = this.cadidato.regimeInteresse.replace(valor + ', ', '');
      }
    }

    if (tipo === 'pcd') {
      this.checkPcd = !this.checkPcd;
    }

    if (tipo === 'pos') {
      if ($event.detail.checked) {
        if (valor === 'es') this.posGraduacao.especializacao = true;
        if (valor === 'me') this.posGraduacao.mestrado = true;
        if (valor === 'dr') this.posGraduacao.doutorado = true;
        if (valor === 'pd') this.posGraduacao.posDoutorado = true;
      } else {
        if (valor === 'es') this.posGraduacao.especializacao = false;
        if (valor === 'me') this.posGraduacao.mestrado = false;
        if (valor === 'dr') this.posGraduacao.doutorado = false;
        if (valor === 'pd') this.posGraduacao.posDoutorado = false;
      }
    }


  }


  onSelectEscolaridade($event: any, tipo : boolean) {
    if (tipo) {
      this.cadidato.nivelInstrucao = $event.detail.value;
    } else {
      if(this.cadidato.nivelInstrucao.includes('superiorC')) {
        this.posGraduacao.especializacao = $event.detail.value.includes('es');
        this.posGraduacao.mestrado = $event.detail.value.includes('me');
        this.posGraduacao.doutorado = $event.detail.value.includes('dr');
        this.posGraduacao.posDoutorado = $event.detail.value.includes('pd');
      }
      console.log(this.posGraduacao)
    }


  }

  onFileChange(fileChangeEvent: any, type: string) {
    // Verifica o tipo de arquivo que foi passado, se for imagem, o tipo é image/jpeg, se for pdf, o tipo é application/pdf
    if (!(fileChangeEvent.target.files[0].type === 'application/pdf')) {
      fileChangeEvent.target.value = null;
      this.showAlert("Arquivos do Tipo Errado", "O arquivo deve ser do tipo PDF");
    } else {
      // Verifica o tamanho do arquivo, se for maior que 2MB, o arquivo é invalido
      if (fileChangeEvent.target.files[0].size > 2000000) {
        fileChangeEvent.target.value = null;
        this.showAlert("Arquivo Muito Grande", "O arquivo deve ter no máximo 2MB");

      } else {
        if (type === 'curriculo') {
          this.fileCurriculo = undefined;
          this.fileCurriculo = fileChangeEvent.target.files[0];
        } else if (type === 'pcd') {
          this.filePcd = undefined;
          this.filePcd = fileChangeEvent.target.files[0];
        }
      }
    }
  }

  onCepChange($event: any) {
    this.digitando = true;
  }

  onCepClick(i: { uf: string; cidade: string; endereco: string; cep: number }) {

  }

  // Limpa TODOS os campos do formulário

  adicionarContato() {
    if (this.contato && this.tipoContato) {
      const novoContato = {
        contato: this.contato,
        tipoContato: this.tipoContato,
      };

      this.cadidato.contatos.push(novoContato);
      this.contato = ''; // Limpe os campos após adicionar o contato
      this.tipoContato = ''; // Limpe o campo do tipo de contato
      this.contatoValido = false;
    }
  }

  removerContato(index: number) {
    this.cadidato.contatos.splice(index, 1);

  }

  limparCampos() {
    this.cadidato.nome = '';
    this.cadidato.nomeSocial = '';
    this.cadidato.genero = '';
    this.cadidato.cpf = '';
    this.cadidato.email = '';
    this.cadidato.senha = '';
    this.cadidato.pretensaoSalarial = 0;
    this.cadidato.cep = '';
    this.cadidato.cidade = '';
    this.cadidato.logradouro = '';
    this.cadidato.uf = '';
    this.cadidato.complemento = null;
    this.cadidato.disponibilidade = '';
    this.cadidato.cnh = '';
    this.cadidato.nivelInstrucao = '';
    this.cadidato.dataNascimento = '';
    this.cadidato.regiaoInteresse = false;
    this.cadidato.cepInteresse = null;
    this.cadidato.cidadeInteresse = null;
    this.cadidato.ufInteresse = null;
    this.cadidato.modalidadeInteresse = '';
    this.cadidato.regimeInteresse = '';
    this.cadidato.tipoVagaInteresse = '';
    this.cadidato.areas = '';
    this.cadidato.curriculo = null;
    this.cadidato.pcd = null;
    this.cadidato.deletedAt = null;
    this.cadidato.contatos = [];
    this.listaAreas = [];
    this.areaSelecionada = null;
    this.checkPcd = true;
    this.digitando = false;
    this.quantidade = 1;
    this.posGraduacao = {
      especializacao: false,
      mestrado: false,
      doutorado: false,
      posDoutorado: false
    };

    this.ngOnInit();


  }

  private senhaValida(): boolean {

    if (this.cadidato.senha != this.checkSenha) {
      this.showAlert('Campo preenchido de forma errada', 'Senhas não conferem');
      return false;
    } else if (!this.senhaRequisitos.lengthCheck) {
      this.showAlert('Campo preenchido de forma errada', 'Senha deve conter no mínimo 6 caracteres');
      return false;
    } else if (!this.senhaRequisitos.upperLowerCheck) {
      this.showAlert('Campo preenchido de forma errada', 'Senha deve conter letras maiúsculas e minúsculas');
      return false;
    } else if (!this.senhaRequisitos.numberCheck) {
      this.showAlert('Campo preenchido de forma errada', 'Senha deve conter números');
      return false;
    } else if (!this.senhaRequisitos.specialCharCheck) {
      this.showAlert('Campo preenchido de forma errada', 'Senha deve conter caracteres especiais');
      return false;
    }
    return true;
  }

  verificarEmail() {
    this.cadidato.email = this.cadidato.email.toLowerCase();
    this.cadidato.email = this.cadidato.email.trim();

    this.emailValido = this.cadidato.email.includes('@') && this.cadidato.email.split('@')[1].includes('.');

  }

  verificarCPF() {

    this.cadidato.cpf = this.cadidato.cpf.trim();

    this.cpfValido = this.cadidato.cpf.length == 14 && this.cadidato.cpf.includes('.') && this.cadidato.cpf.includes('-');

  }

  verificarContato() {

    if (this.tipoContato == 'E-mail') {
      this.contato = this.contato.trim();
      // valida se o email tem @ e o . depois do @
      this.contatoValido = this.contato.includes('@') && (this.contato.split('@')[1].includes('.'));
    } else if (this.tipoContato == 'Telefone' || this.tipoContato == 'Celular') {
      // Verifica se o telefone tem algum caractere que não seja numero ou + ou - ou ( ou )
      this.contatoValido = !(this.contato.match(/[^0-9\+\-\(\)]/g) != null) && this.contato.length <= 20;
    } else {
      this.contatoValido = true;
    }

  }

  private validarCpf(cpf: string) {
    let soma = 0;
    let resto;

    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf == '00000000000') return true;
    if (cpf == '11111111111') return true;
    if (cpf == '22222222222') return true;
    if (cpf == '33333333333') return true;
    if (cpf == '44444444444') return true;
    if (cpf == '55555555555') return true;
    if (cpf == '66666666666') return true;
    if (cpf == '77777777777') return true;
    if (cpf == '88888888888') return true;
    if (cpf == '99999999999') return true;
    if (cpf == '') return true;
    if (cpf.length != 11) return true;
    if (cpf == '12345678909') return true;


    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;

    if (resto != parseInt(cpf.substring(9, 10))) return true;

    soma = 0;

    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;

    if (resto != parseInt(cpf.substring(10, 11))) return true;

    return false;
  }


  private validarPretensaoSalarial() {

    console.log(this.cadidato.pretensaoSalarial)

    if (!this.valorACombinar) {
      let valor: number = parseFloat(this.cadidato.pretensaoSalarial.toString().replace(',', '.').replace('R$', ''));
      if (valor < 0 || valor > 100000) {
        this.showAlert('Campo preenchido de forma errada', 'Valor inválido');
        return true;
      }

    }
    return false;

  }

  async buscarCep() {
    const cep = this.cadidato.cep.replace(/\D/g, '');
    // this.profissional.cep = this.profissional.cep.replace(/\D/g, '');
    console.log(this.cadidato.cep);
    const cepEncontrado = await this.consultCepService.getCep(cep);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.cadidato.cidade = cepEncontrado.city
      this.cadidato.uf = cepEncontrado.state
      this.cadidato.logradouro = cepEncontrado.street
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(cep);
      if (cepEncontrado2) {
        this.cadidato.cidade = cepEncontrado2.cidade
        this.cadidato.uf = cepEncontrado2.uf
        this.cadidato.logradouro = cepEncontrado2.logradouro
        this.cadidato.numero = cepEncontrado2.numero
        this.showToast('CEP encontrado', 'success');
      } else {
        this.cadidato.cidade = ''
        this.cadidato.uf = ''
        this.cadidato.logradouro = ''
        this.cadidato.numero = ''
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }

  async buscarCepInteresse() {
    if (this.cadidato.cepInteresse == null) {
      return;
    }
    const cep = this.cadidato.cepInteresse.toString().replace(/\D/g, '');
    console.log(cep)
    console.log('Cep interesse' + this.cadidato.cepInteresse);
    const cepEncontrado = await this.consultCepService.getCep(cep);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.cadidato.cidadeInteresse = cepEncontrado.city;
      this.cadidato.ufInteresse = cepEncontrado.state;
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(cep);
      if (cepEncontrado2) {
        this.cadidato.cidadeInteresse = cepEncontrado2.cidade
        this.cadidato.ufInteresse = cepEncontrado2.uf
        this.showToast('CEP encontrado', 'success');
      } else {
        this.cadidato.cidadeInteresse = ''
        this.cadidato.ufInteresse = ''
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }

  cancelar() {
    this.navCtrl.back();
  }
}
