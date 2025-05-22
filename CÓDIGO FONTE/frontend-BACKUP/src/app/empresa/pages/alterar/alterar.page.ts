import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { MaskService } from 'src/app/services/mask.service';
import { CEP } from '../../empresaData';
import { ConsultCepService } from 'src/app/services/consult.cep';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.page.html',
  styleUrls: ['./alterar.page.scss'],
})
export class AlterarPage implements OnInit {

  idEmpresa: number = 0;
  empresa: any = {
    contatos: [],
  };

  nomeEmpresaNovo: string = "";
  cnpjNovo: string = "";
  emailNovo: string = "";
  senhaNova: string = "";
  cepNovo: string = "";
  ufNova: string = "";
  cidadeNova: string = "";
  logradouroNovo: string = "";
  numeroNovo: string = "";
  complementoNovo: string = "";
  siteNovo: string = "";
  idAreaNovo: number = 0;
  contatosNovos: any = [];


  contato: string = "";
  tipoContato: string = "";
  areas: any[] = [];
  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  public type = 'password';
  public showPass = false;
  public emailValido = true;
  public checkSenha: string = '';

  criarNovaAreaSelecionada: boolean = false;
  novaAreaNome: string = '';

  searchTerm: string = '';
  filteredAreas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    public maskService: MaskService,
    private consultCepService: ConsultCepService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idEmpresa = params['idEmpresa'];
      // Se quem estiver autenticado for uma empresa e o id passado for diferente do id dela, redireciona ela para a página dela
      if (localStorage.getItem('userType') == 'Empresa' && localStorage.getItem('userId') != this.idEmpresa.toString()) {
        this.navCtrl.navigateForward(['/alterar-empresa'], {
          queryParams: {
            idEmpresa: localStorage.getItem('userId')
          }
        });
      } else if (
        //Caso ela esteja vendo a página dela ou seja um administrador vendo qualquer empresa.
        (localStorage.getItem('userType') == 'Empresa' && localStorage.getItem('userId') == this.idEmpresa.toString())
        || localStorage.getItem('userType') == 'Administrador') {
        this.carregarEmpresaPorId(this.idEmpresa);
        this.cepNovo.toString().replace(/^(\d{5})(\d{3})$/, '$1-$2');
        this.carregarListaAreas();
      }
    });
  }

  async buscarCep() {
    //console.log(this.cepNovo);
    const cepEncontrado = await this.consultCepService.getCep(this.cepNovo);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.cidadeNova = cepEncontrado.city.substring(0, 45);
      this.ufNova = cepEncontrado.state;
      this.logradouroNovo = cepEncontrado.street.substring(0, 60);
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(this.cepNovo);
      if (cepEncontrado2) {
        this.cidadeNova = cepEncontrado2.cidade.substring(0, 45);
        this.ufNova = cepEncontrado2.uf;
        this.logradouroNovo = cepEncontrado2.logradouro.substring(0, 60);
        this.numeroNovo = cepEncontrado2.numero;
        this.showToast('CEP encontrado', 'success');
      } else {
        this.cidadeNova = '';
        this.ufNova = '';
        this.logradouroNovo = '';
        this.numeroNovo = '';
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
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

  carregarListaAreas() {
    api.get('/list-areas')
      .then(response => {
        this.areas = response.data;
        this.filteredAreas = this.areas;
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  async carregarEmpresaPorId(idEmpresa: number) {
    try {
      const response = await api.get(`/find-empresa/${idEmpresa}`);
      this.empresa = response.data;

      this.nomeEmpresaNovo = this.empresa.nomeEmpresa;
      this.cnpjNovo = this.empresa.cnpj.toString().replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      this.cnpjNovo.toString().replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      this.emailNovo = this.empresa.email;
      //this.senhaNova = this.empresa.senha;
      this.cepNovo = this.empresa.cep.toString().replace(/^(\d{5})(\d{3})$/, '$1-$2');
      this.ufNova = this.empresa.uf;
      console.log('uf:', this.empresa.uf);
      console.log('uf:', this.ufNova);

      this.cidadeNova = this.empresa.cidade;
      this.logradouroNovo = this.empresa.logradouro;
      this.numeroNovo = this.empresa.numero;
      this.complementoNovo = this.empresa.complemento;
      this.siteNovo = this.empresa.site;
      this.idAreaNovo = this.empresa.idArea;

      this.contatosNovos = this.empresa.contatos;
    } catch (error) {
      console.error('Erro ao carregar a empresa:', error);
      this.showToast('Erro ao carregar a empresa', 'danger');
    }
  }

  async formValido() {
    if (this.nomeEmpresaNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Nome da Empresa não informado.')
      return false;
    } else if (this.cnpjNovo == '') {
      this.showAlert('Campos Obrigatórios', 'CNPJ não informado.')
      return false;
    } else if (!this.validarCNPJ(this.cnpjNovo.toString())) {
      this.showAlert('Campos Obrigatórios', 'CNPJ inválido.');
      return false;
    } else if (this.emailNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Email não informado.')
      return false;
    } else if (!this.emailValido) {
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if (this.cepNovo == '') {
      this.showAlert('Campos Obrigatórios', 'CEP não informado.')
      return false;
    } else if (this.ufNova == '') {
      this.showAlert('Campos Obrigatórios', 'UF não informada.')
      return false;
    } else if (this.cidadeNova == '') {
      this.showAlert('Campos Obrigatórios', 'Cidade não informada.')
      return false;
    } else if (this.logradouroNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Logradouro não informado.')
      return false;
    } else if (this.numeroNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Número não informado.')
      return false;
    } else if (this.idAreaNovo == 0) {
      this.showAlert('Campos Obrigatórios', 'Área não informada.')
      return false;
    } else if ((this.senhaNova!='' && this.checkSenha!='') && !(this.senhaNova === this.checkSenha && this.senhaRequisitos.lengthCheck && this.senhaRequisitos.upperLowerCheck && this.senhaRequisitos.numberCheck && this.senhaRequisitos.specialCharCheck)) {
      this.showAlert('Campos Obrigatórios', 'Senha inválida.')
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
      this.carregarListaAreas();

      this.criarNovaAreaSelecionada = false;
    } catch (error) {
      console.error('Erro ao criar nova área:', error);
      this.showToast('Erro ao criar nova área', 'danger');
    }
  }

  async retirarMascara() {
    this.cnpjNovo = this.cnpjNovo.replace(/[^\d]/g, '');
    this.cepNovo = this.cepNovo.toString().replace(/\D/g, '');
  }

  async alterarEmpresa() {
    if (await this.formValido()) {
      await this.retirarMascara();
      try {
        const dadosDeAlteracao = {
          nomeEmpresa: this.nomeEmpresaNovo,
          email: this.emailNovo,
          senha: this.senhaNova,
          cnpj: this.cnpjNovo,
          cep: this.cepNovo,
          uf: this.ufNova,
          logradouro: this.logradouroNovo,
          cidade: this.cidadeNova,
          complemento: this.complementoNovo,
          numero: this.numeroNovo,
          site: this.siteNovo,
          idArea: this.idAreaNovo,
          contatos: this.contatosNovos,
        };
        // Atualizar dados da empresa
        const response = await api.put(`/update-empresa/${this.idEmpresa}`, dadosDeAlteracao);

        // Atualizar dados do CEP
        try {
          await api.post('/create-cep', { cep: this.cepNovo, uf: this.ufNova, cidade: this.cidadeNova, logradouro: this.logradouroNovo, numero: this.numeroNovo });
        } catch (cepError: any) {
          // Ignorar erros relacionados ao CEP
          if (cepError.response.status !== 400 || cepError.config.url !== '/create-cep') {
            throw cepError; // Lança o erro se não for relacionado ao CEP
          }
        }

        if (response.status === 200) {
          this.showToast('Dados alterados com sucesso', 'success');
          if (localStorage.getItem('userType') == 'Empresa') {
            this.navCtrl.navigateForward('/perfil-empresa')
          } else {
            this.navCtrl.navigateForward('/listar-empresa')
          }
        }
      } catch (error: any) {
        if (error.response.status === 409) {
          // Tratamento para conflitos (por exemplo, email ou CNPJ duplicado)
          if (error.response.data.message.includes('email')) {
            this.showToast('Já existe uma empresa com o mesmo e-mail cadastrada', 'danger');
          } else if (error.response.data.message.includes('CNPJ')) {
            this.showToast('Já existe uma empresa com o mesmo CNPJ cadastrada', 'danger');
          }
        } else {
          // Outros erros
          console.error('Erro ao alterar a Empresa:', error);
          this.showToast('Erro ao alterar a Empresa', 'danger');
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
    this.contatosNovos.splice(index, 1);
  }

  async showToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
      color: color,
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
    this.senhaRequisitos.lengthCheck = this.senhaNova.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.senhaNova) && /[A-Z]/.test(this.senhaNova);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.senhaNova);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç_,"+-]/.test(this.senhaNova);
  }

  verificarEmail(): void {
    this.emailNovo = this.emailNovo.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValido = emailRegex.test(this.emailNovo);
  }

  cancelar() {
    this.navCtrl.pop();
  }
}