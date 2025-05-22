import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AlertController, NavController, PopoverController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import {Regime} from "../../../../../../shared/enums/Regime";
import {TipoVaga} from "../../../../../../shared/enums/TipoVaga";
import {Modalidade} from "../../../../../../shared/enums/Modalidade";
import {PopoverSelectComponent} from "../cadastro/popover-select/popover-select.component";
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";
import firebase from "firebase/compat";
import storage = firebase.storage;
import {MaskService} from "../../../services/mask.service";
import {AxiosError} from "axios";
import {ConsultCepService} from "../../../services/consult.cep";

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.page.html',
  styleUrls: ['./alterar.page.scss'],
})
export class AlterarPage implements OnInit {

  // Dados do usuario logado
  idUsuario: any = null
  tipoUsuario: any = null;


  id: number = 0;
  candidato: any;

  fileCurriculo: File | undefined;
  filePcd: File | undefined;

  contato: any

  tipoContato: any

  contatos: any[] = []

  posGraduacao = {
    especializacao: false,
    mestrado: false,
    doutorado: false,
    posDoutorado: false
  }


  nomeNovo: string = ''
  nomeSocialNovo: string = ''
  generoNovo: string = ''
  cpfNovo: string = ''
  emailNovo: string = ''
  senhaNovo: string = ''
  checkSenhaNovo: string = ''
  pretensaoSalarialNovo: number = 0
  cepNovo: string = ''
  logradouroNovo: string = ''
  cidadeNovo: string = ''
  numeroNovo: string = ''
  ufNovo: string = ''
  complementoNovo: string = ''
  contatosNovo: any[] = []
  disponibilidadeNovo: string = ''
  cnhNovo: string = ''
  nivelInstrucaoNovo: string = ''
  dataNascimentoNovo: string = ''
  regiaoInteresseNovo: boolean = false
  cepInteresseNovo: string = ''
  cidadeInteresseNovo: string = ''
  ufInteresseNovo: string = ''
  modalidadeInteresseNovo: string = ''
  regimeInteresseNovo: string = ''
  tipoVagaInteresseNovo: string = ''
  areasNovo: any[] = []
  curriculoNovo: File | undefined
  pcdNovo: File | undefined
  tipoVagaNovo: string = ''


  areas = []
  listaAreas: any[] = [];
  checkPcd: boolean = false;
  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  public emailValido: boolean = true;
  public cpfValido: boolean = true;
  public contatoValido: boolean = false;
  public cepValido: boolean = false;
  public nomeValido: boolean = false;
  public valorACombinar: boolean = false;
  public todasAreas: boolean = false;

  public type: string = 'password';
  public showPass: boolean = false;

  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private alertController: AlertController,
    public maskService: MaskService,
    private consultCepService: ConsultCepService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.idUsuario = localStorage.getItem('userId');
      this.tipoUsuario = localStorage.getItem('userType');
      if (this.idUsuario == null || this.tipoUsuario == null) {
        this.navCtrl.navigateForward('/login');
      } else if (this.idUsuario != this.id && this.tipoUsuario != TipoUsuario.ADMINISTRADOR) {
        this.navCtrl.navigateForward('/alterar-candidato/' + this.idUsuario);
      } else {
        this.carregarCandidatoPorId(this.id);
        this.carregarAreas();
      }
    });
  }

  async carregarAreas() {
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

  async carregarCandidatoPorId(id: number) {
    try {
      const response = await api.get(`/find-candidato/${id}`); // Substitua '/find' pela rota real em seu servidor
      this.candidato = response.data;

      this.nomeNovo = this.candidato.nome;
      this.nomeSocialNovo = this.candidato.nomeSocial;
      this.candidato.cpf = this.formatarCPFToString(this.candidato.cpf);
      this.cpfNovo = this.candidato.cpf;
      this.emailNovo = this.candidato.email;
      this.generoNovo = this.candidato.genero;
      if (this.candidato.pretensaoSalarial > 0) {
        this.pretensaoSalarialNovo = this.formatarSalario(this.candidato.pretensaoSalarial);
        this.valorACombinar = false;
      } else {
        this.valorACombinar = true;
        this.pretensaoSalarialNovo = 0;
      }
      // Transforma o cep em string para que o campo de cep seja preenchido com o formato correto (ex: 00000-000)
      this.candidato.cep = this.formatarCep(this.candidato.cep);
      this.cepNovo = this.candidato.cep;
      this.logradouroNovo = this.candidato.logradouro;
      this.cidadeNovo = this.candidato.cidade;
      this.numeroNovo = this.candidato.numero;
      this.ufNovo = this.candidato.uf;
      this.complementoNovo = this.candidato.complemento;
      this.candidato.disponibilidade = this.candidato.disponibilidade.split(',');
      this.disponibilidadeNovo = this.candidato.disponibilidade;
      this.cnhNovo = this.candidato.cnh;
      this.dataNascimentoNovo = this.candidato.dataNascimento;
      this.regiaoInteresseNovo = this.candidato.regiaoInteresse;
      this.cepInteresseNovo = this.formatarCep(this.candidato.cepInteresse);
      this.cidadeInteresseNovo = this.candidato.cidadeInteresse;
      this.ufInteresseNovo = this.candidato.ufInteresse;
      this.candidato.modalidadeInteresse = this.candidato.modalidadeInteresse.split(',');
      this.modalidadeInteresseNovo = this.candidato.modalidadeInteresse;
      this.candidato.regimeInteresse = this.candidato.regimeInteresse.split(',');
      this.regimeInteresseNovo = this.candidato.regimeInteresse;
      this.candidato.tipoVagaInteresse = this.candidato.tipoVagaInteresse.split(',');
      this.tipoVagaInteresseNovo = this.candidato.tipoVagaInteresse;
      if (this.candidato.areas.includes('Todas')) {
        this.todasAreas = true;
        this.areasNovo = [];
      } else {
        this.areasNovo = this.candidato.areas;
      }
      this.curriculoNovo = this.candidato.curriculo;
      this.pcdNovo = this.candidato.pcd;
      if (this.candidato.contatos) {
        this.contatos = this.candidato.contatos;
      } else {
        this.contatos = [];
      }


      this.checkPcd = this.candidato.pcd !== null;

      if (this.candidato.nivelInstrucao.includes('superiorC')) {

        if (this.candidato.nivelInstrucao.includes('especialização')) {
          this.posGraduacao.especializacao = true;
        }
        if (this.candidato.nivelInstrucao.includes('mestrado')) {
          this.posGraduacao.mestrado = true;
        }
        if (this.candidato.nivelInstrucao.includes('doutorado')) {
          this.posGraduacao.doutorado = true;
        }
        if (this.candidato.nivelInstrucao.includes('pós-doutorado')) {
          this.posGraduacao.posDoutorado = true;
        }

        this.nivelInstrucaoNovo = 'superiorC';

      } else this.nivelInstrucaoNovo = this.candidato.nivelInstrucao;

      this.listaAreas = this.candidato.areas.split(', ').map((area: any) => {
        return {
          nome: area,
          checked: true
        };
      });

    } catch
      (error) {
      console.error('Erro ao carregar o candiato:', error);
      this.showToast('Erro ao carregar o candiato', 'danger');
    }
  }

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.senhaNovo.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.senhaNovo) && /[A-Z]/.test(this.senhaNovo);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.senhaNovo);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç,"+-]/.test(this.senhaNovo);
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

    if (this.nomeNovo == '' || this.nomeNovo == null) {
      this.showAlert('Campo obrigatório', 'Nome não informado');
      return false;
    } else if (this.cpfNovo == '' || this.cpfNovo == null) {
      this.showAlert('Campo obrigatório', 'CPF não informado');
      return false;
    } else if (this.cpfNovo.length < 14 || this.cpfNovo.length > 14) {
      this.showAlert('Campo preenchido de forma errada', 'CPF inválido');
      return false;
    } else if (this.validarCpf(this.cpfNovo)) {
      this.showAlert('Campo preenchido de forma errada', 'CPF Não existe');
      return false;
    } else if (this.emailNovo == '' || this.emailNovo == null) {
      this.showAlert('Campo obrigatório', 'Email não informado');
      return false;
    } else if (!this.emailNovo.includes('@') && !this.emailNovo.includes('.')) {
      this.showAlert('Campo preenchido de forma errada', 'Email inválido');
      return false;
    } else if (this.cepNovo == '' || this.cepNovo == null) {
      this.showAlert('Campo obrigatório', 'CEP não informado');
      return false;
    } else if (this.cepNovo.toString().length < 8 || this.cepNovo.toString().length > 9) {
      this.showAlert('Campo preenchido de forma errada', 'CEP inválido');
      return false;
    } else if (this.ufNovo == '' || this.ufNovo == null) {
      this.showAlert('Campo obrigatório', 'UF não informada');
      return false;
    } else if (this.cidadeNovo == '' || this.cidadeNovo == null) {
      this.showAlert('Campo obrigatório', 'Cidade não informada');
      return false;
    } else if (this.logradouroNovo == '' || this.logradouroNovo == null) {
      this.showAlert('Campo obrigatório', 'Logradouro não informado');
      return false;
    } else if (this.numeroNovo == '' || this.numeroNovo == null) {
      this.showAlert('Campo obrigatório', 'Número não informado');
      return false;
    } else if (this.nivelInstrucaoNovo == '' || this.nivelInstrucaoNovo == null) {
      this.showAlert('Campo obrigatório', 'Nível de instrução não informado');
      return false;
    } else if (this.tipoVagaInteresseNovo.length < 1) {
      console.log(this.tipoVagaInteresseNovo)
      this.showAlert('Campo obrigatório', 'Tipo de vaga não informado');
      return false;
    } else if (this.tipoVagaInteresseNovo.includes('Emprego') && (this.regimeInteresseNovo == '' || this.regimeInteresseNovo == null)) {
      this.showAlert('Campo obrigatório', 'Regime de trabalho não informado');
      return false;
    } else if (this.modalidadeInteresseNovo == '' || this.modalidadeInteresseNovo == null) {
      this.showAlert('Campo obrigatório', 'Modalidade de trabalho não informada');
      return false;
    } else if (this.disponibilidadeNovo == '' || this.disponibilidadeNovo == null) {
      this.showAlert('Campo obrigatório', 'Disponibilidade não informada');
      return false;
    } else if (this.cnhNovo == '' || this.cnhNovo == null) {
      this.showAlert('Campo obrigatório', 'CNH não informada');
      return false;
    } else if (this.dataNascimentoNovo == '' || this.dataNascimentoNovo == null) {
      this.showAlert('Campo obrigatório', 'Data de nascimento não informada');
      return false;
    } else if (this.dataNascimentoNovo.length < 10 || this.dataNascimentoNovo.length > 10) {
      this.showAlert('Campo preenchido de forma errada', 'Data de nascimento inválida');
      return false;
    } else if (this.generoNovo == '' || this.generoNovo == null) {
      this.showAlert('Campo obrigatório', 'Gênero não informado');
      return false;
    } else if (this.contatos.length == 0) {
      this.showAlert('Campo obrigatório', 'Contato não informado');
      return false;
    } else if (this.regiaoInteresseNovo) {
      if (this.cepInteresseNovo == null || this.cepInteresseNovo == '') {
        this.showAlert('Campo obrigatório', 'CEP de interesse não informado');
        return false;
      } else if (this.ufInteresseNovo == null || this.ufInteresseNovo == '') {
        this.showAlert('Campo obrigatório', 'UF de interesse não informada');
        return false;
      } else if (this.cidadeInteresseNovo == null || this.cidadeInteresseNovo == '') {
        this.showAlert('Campo obrigatório', 'Cidade de interesse não informada');
        return false;
      }

    }

    return true;
  }

  alterarCandiato() {
    try {
      if (this.formValido()) {


        if (this.cepInteresseNovo) this.cepInteresseNovo = this.cepInteresseNovo.replace(/\D/g, '')
        if (this.todasAreas) this.areasNovo = ['Todas'];
        if (this.valorACombinar)
          this.pretensaoSalarialNovo = 0;
        else
          this.pretensaoSalarialNovo = parseFloat(this.pretensaoSalarialNovo.toString().replace('.', '').replace(',', '.').replace('R$', ''));

        const dadosDeAlteracao = {
          nome: this.nomeNovo,
          nomeSocial: this.nomeSocialNovo,
          cpf: this.formatarCPF(this.cpfNovo),
          email: this.emailNovo,
          senha: this.senhaNovo,
          genero: this.generoNovo,
          pretensaoSalarial: this.pretensaoSalarialNovo,
          cep: this.cepNovo.replace(/\D/g, ''),
          logradouro: this.logradouroNovo,
          cidade: this.cidadeNovo,
          numero: this.numeroNovo,
          uf: this.ufNovo,
          complemento: this.complementoNovo,
          disponibilidade: this.disponibilidadeNovo,
          cnh: this.cnhNovo,
          nivelInstrucao: this.nivelInstrucaoNovo,
          dataNascimento: this.dataNascimentoNovo,
          regiaoInteresse: this.regiaoInteresseNovo,
          cepInteresse: this.cepInteresseNovo,
          cidadeInteresse: this.cidadeInteresseNovo,
          ufInteresse: this.ufInteresseNovo,
          modalidadeInteresse: this.modalidadeInteresseNovo,
          regimeInteresse: this.regimeInteresseNovo,
          tipoVagaInteresse: this.tipoVagaInteresseNovo,
          areas: this.areasNovo,
          contatos: this.contatos,
          tipo: 'CANDIDATO'

        };

        if (dadosDeAlteracao.nivelInstrucao === 'superiorC') {
          console.log(this.posGraduacao)
          if (this.posGraduacao.especializacao) dadosDeAlteracao.nivelInstrucao += 'especialização, ';
          if (this.posGraduacao.mestrado) dadosDeAlteracao.nivelInstrucao += 'mestrado, ';
          if (this.posGraduacao.doutorado) dadosDeAlteracao.nivelInstrucao += 'doutorado, ';
          if (this.posGraduacao.posDoutorado) dadosDeAlteracao.nivelInstrucao += 'pós-doutorado, ';
        }

        let dataForm = new FormData();
        dataForm.append('candidato', JSON.stringify(dadosDeAlteracao));
        if (this.fileCurriculo)
          dataForm.append('curriculo', this.fileCurriculo);
        if (this.filePcd)
          dataForm.append('pcd', this.filePcd);

        api.put(`/update-candidato/${this.id}`, dataForm).then(
          (response) => {
            if (localStorage.getItem('userType') === TipoUsuario.ADMINISTRADOR)
              this.navCtrl.back()
            else
              this.navCtrl.back()
            this.showToast('Dados alterados com sucesso', 'success');
          }
        ).catch((error) => {
            if (error instanceof AxiosError) {
              console.log(error.response?.data)
              this.showToast(error.response?.data?.message, 'danger');
            } else {
              this.showToast('Erro ao alterar o candiato', 'danger');
              console.log(error)
            }
            console.error('Erro ao alterar o candiato:', error);
          }
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data)
        this.showToast(error.response?.data?.message, 'danger');
      } else {
        this.showToast('Erro ao alterar o candiato', 'danger');
        console.log(error)
      }
      console.error('Erro ao alterar o candiato:', error);

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
    toast.present();
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

    if (data) {
      this.listaAreas = data;
      this.areasNovo = [];
      this.listaAreas.forEach((area: any) => {
          if (this.areasNovo.indexOf(area.nome) === -1) {
            this.areasNovo.push(area.nome);
          }
        }
      );

    }
  }


  onIonChange(event: any, selectName: any) {


    if (selectName === 'regime') {
      this.regimeInteresseNovo = event.detail.value;
    } else if (selectName === 'tipoVaga') {
      this.tipoVagaNovo = event.detail.value;
    } else if (selectName === 'modalidade') {
      this.modalidadeInteresseNovo = event.detail.value;
    } else if (selectName === 'cnh') {
      this.cnhNovo = event.detail.value;
    } else if (selectName === 'genero') {
      this.generoNovo = event.detail.value;
    } else if (selectName === 'nivelInstrucao') {
      this.nivelInstrucaoNovo = event.detail.value;
    } else if (selectName === 'disponibilidade') {
      this.disponibilidadeNovo = event.detail.value;
    }

  }

  onFileChange(fileChangeEvent: any, type: string) {
// Verifica o tipo de arquivo que foi passado, se for imagem, o tipo é image/jpeg, se for pdf, o tipo é application/pdf
    if (!(fileChangeEvent.target.files[0].type === 'application/pdf')) {
      this.fileCurriculo = undefined;
      fileChangeEvent.target.value = null;
      this.showAlert("Arquivos do Tipo Errado", "O arquivo deve ser do tipo PDF");
    } else {
      // Verifica o tamanho do arquivo, se for maior que 50MB, o arquivo é invalido
      if (fileChangeEvent.target.files[0].size > 2000000) {
        this.fileCurriculo = undefined;
        fileChangeEvent.target.value = null;
        this.showAlert("Arquivo Muito Grande", "O arquivo deve ter no máximo 2MB");

      } else {
        if (type === 'curriculo') {
          this.fileCurriculo = fileChangeEvent.target.files[0];
        } else if (type === 'pcd') {
          this.filePcd = fileChangeEvent.target.files[0];
        }
      }
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
        this.modalidadeInteresseNovo += valor + ', ';
      } else {
        this.modalidadeInteresseNovo = this.modalidadeInteresseNovo.replace(valor + ', ', '');
      }
    }

    if (tipo === 'disponibilidade') {
      if ($event.detail.checked) {
        this.disponibilidadeNovo += valor + ', ';
      } else {
        this.disponibilidadeNovo = this.disponibilidadeNovo.replace(valor + ', ', '');
      }
    }

    if (tipo === 'nivelInstrucao') {

    }

    if (tipo === 'tipoVaga') {
      if ($event.detail.checked) {
        this.tipoVagaInteresseNovo += valor + ', ';
        if (valor === 'emprego') this.regimeInteresseNovo = '';

      } else {
        this.tipoVagaInteresseNovo = this.tipoVagaInteresseNovo.replace(valor + ', ', '');
      }
    }

    if (tipo === 'regime') {
      if ($event.detail.checked) {
        this.regimeInteresseNovo += valor + ', ';
      } else {
        this.regimeInteresseNovo = this.regimeInteresseNovo.replace(valor + ', ', '');
      }
    }

    if (tipo === 'pcd') {
      this.checkPcd = !this.checkPcd;
    }

  }

  onSelectEscolaridade($event: any) {
    if (!($event.detail.value === 'es' || $event.detail.value === 'me' || $event.detail.value === 'dr' || $event.detail.value === 'pd')) {
      this.nivelInstrucaoNovo = $event.detail.value;
    }
  }

  adicionarContato() {
    if (this.contato && this.tipoContato) {
      const novoContato = {
        contato: this.contato,
        tipoContato: this.tipoContato,
      };

      this.contatos.push(novoContato);
      this.contato = ''; // Limpe os campos após adicionar o contato
      this.tipoContato = ''; // Limpe o campo do tipo de contato
      this.contatoValido = false;
    }
  }

  removerContato(index: number) {
    this.contatos.splice(index, 1);

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

  private formatarCep(cep: any) {
    if (cep) {
      cep = cep.toString().replace(/\D/g, '');
      cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
      return cep;
    }
  }

  private formatarSalario(pretensaoSalarial: any) {
    if (pretensaoSalarial) {
      // Troca o ponto por vigurla
      pretensaoSalarial = pretensaoSalarial.toString().replace(/\./g, ',');
      // Adiciona o R$ no inicio
      pretensaoSalarial = 'R$ ' + pretensaoSalarial;
      // Adiciona 00 no final caso não tenha
      const ponto = pretensaoSalarial.indexOf(',');
      if (ponto == -1) {
        pretensaoSalarial += ',00';
      } else {
        const decimal = pretensaoSalarial.substring(ponto + 1);
        if (decimal.length == 1) {
          pretensaoSalarial += '0';
        }
      }

      return pretensaoSalarial;
    }
  }


  verificarEmail() {
    this.emailNovo = this.emailNovo.toLowerCase();
    this.emailNovo = this.emailNovo.trim();

    if (this.emailNovo.includes('@') && this.emailNovo.includes('.')) {
      this.emailValido = true;
    } else {
      this.emailValido = false;
    }

  }

  verificarCPF() {

    this.cpfNovo = this.cpfNovo.trim();

    this.cpfValido = this.cpfNovo.length == 14 && this.cpfNovo.includes('.') && this.cpfNovo.includes('-');

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

    console.log(this.pretensaoSalarialNovo)

    if (!this.valorACombinar) {
      let valor: number = parseFloat(this.pretensaoSalarialNovo.toString().replace(',', '.').replace('R$', ''));
      if (valor < 0) {
        this.showAlert('Campo preenchido de forma errada', 'Valor inválido');
        return true;
      }

    }
    return false;

  }

  cancelar() {
    this.navCtrl.back();
  }

  formatarCPF(cpf: string): string {

    // Tira os . e - do cpf
    return cpf.replace(/\D/g, '');

  }

  formatarCPFToString(cpf: number): string {
    // Coloca . e - no cpf
    return cpf.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  async buscarCep() {
    const cep = this.cepNovo.replace(/\D/g, '');
    // this.profissional.cep = this.profissional.cep.replace(/\D/g, '');
    const cepEncontrado = await this.consultCepService.getCep(cep);
    if (cepEncontrado) {
      this.cidadeNovo = cepEncontrado.city
      this.ufNovo = cepEncontrado.state
      this.logradouroNovo = cepEncontrado.street
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(cep);
      if (cepEncontrado2) {
        this.cidadeNovo = cepEncontrado2.cidade
        this.ufNovo = cepEncontrado2.uf
        this.logradouroNovo = cepEncontrado2.logradouro
        this.numeroNovo = cepEncontrado2.numero
        this.showToast('CEP encontrado', 'success');
      } else {
        this.cidadeNovo = ''
        this.ufNovo = ''
        this.logradouroNovo = ''
        this.numeroNovo = ''
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }

  async buscarCepInteresse() {
    if (this.cepInteresseNovo == null) {
      return;
    }
    const cep = this.cepInteresseNovo.toString().replace(/\D/g, '');
    const cepEncontrado = await this.consultCepService.getCep(cep);
    if (cepEncontrado) {
      this.cidadeInteresseNovo = cepEncontrado.city;
      this.ufInteresseNovo = cepEncontrado.state;
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(cep);
      if (cepEncontrado2) {
        this.cidadeInteresseNovo = cepEncontrado2.cidade
        this.ufInteresseNovo = cepEncontrado2.uf
        this.showToast('CEP encontrado', 'success');
      } else {
        this.cidadeInteresseNovo = ''
        this.ufInteresseNovo = ''
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }

}
