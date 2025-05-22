import { Component, OnInit, ViewChild } from '@angular/core';
import { CEP, EmpresaData } from '../../empresaData';
import { AlertController, IonSelect, NavController, PopoverController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { MaskService } from 'src/app/services/mask.service';
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConsultCepService } from 'src/app/services/consult.cep';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  empresa: EmpresaData = {
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    senha: '',
    cep: '',
    uf: '',
    cidade: '',
    logradouro: '',
    numero: '',
    complemento: '',
    tipo: 'Empresa',
    site: '',
    idArea: 0,
    contatos: [], // Inicialmente, a lista de contatos está vazia.
  };

  contato: string = '';
  tipoContato: string = '';
  areas: any[] = [];
  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  cadastrado: boolean = false;

  public type = 'password';
  public showPass = false;
  public emailValido = false;
  public checkSenha: string = '';


  criarNovaAreaSelecionada: boolean = false;
  novaAreaNome: string = '';

  searchTerm: string = '';
  filteredAreas: any[] = [];

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    public maskService: MaskService,
    private http: HttpClient,
    private consultCepService: ConsultCepService,
  ) {
  }


  ngOnInit() {
    this.ionViewDidEnter();

  }

  filterAreas() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAreas = this.areas.filter(area => area.nome.toLowerCase().includes(term));

    // Verifica se há uma única correspondência exata
    const exactMatch = this.areas.find(area => area.nome.toLowerCase() === term);

    if (!exactMatch && !(term.trim() === '')) {
      // Se não houver correspondência exata, exiba o alerta
      this.showAlert('Área não encontrada', 'Não há nenhuma área correspondente ao termo de pesquisa. Considere criar uma nova área.');

      // Se não houver correspondências, exiba todas as áreas
      this.filteredAreas = this.areas;
    }

  }


  carregarLista() {
    api.get('/list-areas')
      .then(response => {
        this.areas = response.data;
        this.filteredAreas = this.areas;
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  async formValido() {
    if (this.empresa.nomeEmpresa == '') {
      this.showAlert('Campos Obrigatórios', 'Nome da Empresa não informado.')
      return false;
    } else if (this.empresa.cnpj == '') {
      this.showAlert('Campos Obrigatórios', 'CNPJ não informado.')
      return false;
    } else if (!this.validarCNPJ(this.empresa.cnpj.toString())) {
      this.showAlert('Campos Obrigatórios', 'CNPJ inválido.');
      return false;
    } else if (this.empresa.email == '') {
      this.showAlert('Campos Obrigatórios', 'Email não informado.')
      return false;
    } else if (!this.emailValido) {
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if (this.empresa.senha == '') {
      this.showAlert('Campos Obrigatórios', 'Senha não informada.')
      return false;
    } else if (this.empresa.cep == '') {
      this.showAlert('Campos Obrigatórios', 'CEP não informado.')
      return false;
    } else if (this.empresa.uf == '') {
      this.showAlert('Campos Obrigatórios', 'UF não informada.')
      return false;
    } else if (this.empresa.cidade == '') {
      this.showAlert('Campos Obrigatórios', 'Cidade não informada.')
      return false;
    } else if (this.empresa.logradouro == '') {
      this.showAlert('Campos Obrigatórios', 'Logradouro não informado.')
      return false;
    } else if (this.empresa.numero == '') {
      this.showAlert('Campos Obrigatórios', 'Número não informado.')
      return false;
    } else if (this.empresa.idArea == 0) {
      this.showAlert('Campos Obrigatórios', 'Área não informada.')
      return false;
    } else if (!(this.empresa.senha === this.checkSenha && this.senhaRequisitos.lengthCheck && this.senhaRequisitos.upperLowerCheck && this.senhaRequisitos.numberCheck && this.senhaRequisitos.specialCharCheck)) {
      this.showAlert('Campos Obrigatórios', 'Senhas não coincidem.')
      return false;
    } else {
      return true;
    }
  }

  validarCNPJ(cnpj: string): boolean {
    // Limpa o CNPJ removendo caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');

    // Verifica se o CNPJ tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return false;
    }

    // Calcula os dois dígitos verificadores
    const digitos = cnpjLimpo.substring(0, 12);
    const digitoVerificador1 = this.calcularDigitoVerificador(digitos, 5);
    const digitoVerificador2 = this.calcularDigitoVerificador(digitos + digitoVerificador1, 6);

    // Verifica se os dígitos verificadores calculados são iguais aos fornecidos no CNPJ
    return cnpjLimpo.endsWith(digitoVerificador1.toString() + digitoVerificador2.toString());
  }

  calcularDigitoVerificador(base: string, pesoInicial: number): number {
    let soma = 0;
    let peso = pesoInicial;

    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base.charAt(i)) * peso;
      peso--;

      if (peso < 2) {
        peso = 9;
      }
    }

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  }

  async criarNovaArea() {
    // Inverte o valor de criarNovaAreaSelecionada
    this.criarNovaAreaSelecionada = !this.criarNovaAreaSelecionada;

    // Se o usuário decidiu não criar uma nova área, redefina o nome da nova área
    if (!this.criarNovaAreaSelecionada) {
      this.novaAreaNome = '';
    }
  }

  async salvarNovaArea() {
    const novaArea = {
      nome: this.novaAreaNome,
    };

    if (novaArea.nome.trim() === '') {
      this.showToast('Nome da área não pode ser vazio', 'danger');
      return;
    }

    try {
      const response = await api.post('/create-area', novaArea);
      const areaNova = response.data;
      console.log("Nova área: ", areaNova)
      // Atualiza a lista de áreas
      this.carregarLista();

      this.criarNovaAreaSelecionada = false;
    } catch (error) {
      console.error('Erro ao criar nova área:', error);
      this.showToast('Erro ao criar nova área', 'danger');
    }
  }

  async retirarMascara() {
    this.empresa.cnpj = this.empresa.cnpj.replace(/[^\d]/g, '');
    this.empresa.cep = this.empresa.cep.replace(/[^\d]/g, '');
  }

  async buscarCep() {
    const cepEncontrado = await this.consultCepService.getCep(this.empresa.cep);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.empresa.cidade = cepEncontrado.city.substring(0, 45);
      this.empresa.uf = cepEncontrado.state;
      this.empresa.logradouro = cepEncontrado.street.substring(0, 60);
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(this.empresa.cep);
      if (cepEncontrado2) {
        this.empresa.cidade = cepEncontrado2.cidade.substring(0, 45);
        this.empresa.uf = cepEncontrado2.uf;
        this.empresa.logradouro = cepEncontrado2.logradouro.substring(0, 60);
        this.empresa.numero = cepEncontrado2.numero;
        this.showToast('CEP encontrado', 'success');
      } else {
        this.empresa.cidade = '';
        this.empresa.uf = '';
        this.empresa.logradouro = '';
        this.empresa.numero = '';
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }


  async cadastrarEmpresa() {
    if (await this.formValido()) {
      await this.retirarMascara();
      try {
        const response = await api.post('/create-empresa', this.empresa);

        // Atualizar dados do CEP
        try {
          await api.post('/create-cep', { cep: this.empresa.cep, cidade: this.empresa.cidade, uf: this.empresa.uf, logradouro: this.empresa.logradouro, numero: this.empresa.numero });
        } catch (cepError: any) {
          // Ignorar erros relacionados ao CEP
          if (cepError.response.status !== 400 || cepError.config.url !== '/create-cep') {
            throw cepError; // Lança o erro se não for relacionado ao CEP
          }
        }

        if (response.status === 201) {
          this.navCtrl.navigateForward('/listar-empresa');
          this.showToast('Empresa cadastrada com sucesso', 'success');
        }
      } catch (error: any) {
        if (error.response.status === 409) {
          // Verifique o status da resposta para determinar a mensagem de erro apropriada
          if (error.response.data.message.includes('email')) {
            this.showToast('Já existe uma empresa com o mesmo e-mail cadastrada', 'danger');
          } else if (error.response.data.message.includes('CNPJ')) {
            this.showToast('Já existe uma empresa com o mesmo CNPJ cadastrada', 'danger');
          }
        } else {
          console.error('Erro ao cadastrar a Empresa:', error);
          this.showToast('Erro ao cadastrar a Empresa', 'danger');
        }
      }
    }
  }

  async adicionarContato() {
    if (this.contato && this.tipoContato) {
      const novoContato = {
        contato: this.contato,
        tipoContato: this.tipoContato,
      };

      this.empresa.contatos.push(novoContato);
      this.contato = ''; // Limpe os campos após adicionar o contato
      this.tipoContato = ''; // Limpe o campo do tipo de contato
    }
  }

  async removerContato(index: number) {
    this.empresa.contatos.splice(index, 1);
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

  async showAlert(cabecalho: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.empresa.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.empresa.senha) && /[A-Z]/.test(this.empresa.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.empresa.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç_,"+-]/.test(this.empresa.senha);
  }

  verificarEmail(): void {
    this.empresa.email = this.empresa.email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValido = emailRegex.test(this.empresa.email);
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.cadastrado = params['cadastrado'];
    });
    this.carregarLista();
  }

  cancelar() {
    this.navCtrl.pop();
  }
}
