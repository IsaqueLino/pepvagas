import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, PopoverController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import {ProfissionalLiberalData} from "../../profissionalLiberalData";
import {PopoverSelectComponent} from "../../../candidato/pages/cadastro/popover-select/popover-select.component";
import {ActivatedRoute} from "@angular/router";
import {catchError, distinctUntilChanged, Observable, of, Subject, switchMap, tap} from "rxjs";
import {AxiosError} from "axios";
import {MaskService} from "../../../services/mask.service";
import {ConsultCepService} from "../../../services/consult.cep";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  // Variavel que controla que esta cadastrado este usuario
  // Admin false e Usuario novo true
  cadastrado: boolean = false;

  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];


  private file: File | undefined;

  contatos: number[] = [];

  contato: string = '';

  tipoContato: string = '';

  tiposServicos: any[] = [];

  servicos$: Observable<any[]> = new Observable<any[]>();
  servicosLoading = false;
  servicosInput$ = new Subject<string>();
  selectedServicos: string[] = <any>[];

  profissional: ProfissionalLiberalData = {

    nome: '',
    senha: '',
    email: '',
    tipo: '',
    tipoServicos: [],
    cep: '',
    lograduro: '',
    numero: '',
    complemento: null,
    uf: '',
    cidade: '',
    descricao: '',
    contatos: [],
    arquivoPDF: null,
    arquivoIMG: null

  }

  public checkSenha: string = '';
  customCounterFormatter(inputLenght: number, maxLength: number) {
    return 'Restam ' + (maxLength - inputLenght) + ' caracteres';
  }

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private popoverController: PopoverController,
    public maskService: MaskService,
    private consultCepService: ConsultCepService,

  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.cadastrado = params['cadastrado'];
    });

    this.getServicos().then(() => {
      // Populara o observable servicos$
      this.servicos$ = this.servicosInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.servicosLoading = true),
        switchMap(term => this.getServicosObs(term)),
        tap(() => this.servicosLoading = false)
      );

    })
  }


  public type = 'password';
  public showPass = false;
  public emailValido = false;
  public nomeValido = false;
  public contatoValido = false;

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.profissional.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.profissional.senha) && /[A-Z]/.test(this.profissional.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.profissional.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç,"+-]/.test(this.profissional.senha);
  }

  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };



  async getServicos() {


    api.get('/list-tipo-servicos').then((response) => {
        let data = response.data;

        for (let i = 0; i < data.length; i++) {
          this.tiposServicos.push(data[i].nome);
        }


      }
    ).catch((error) => {
      console.error(error);
    });
  }

  trackByFn(item: any) {
    return item.id;
  }

  formValido() {

    if (this.profissional.nome == '' || this.profissional.nome == null) {
      this.showAlert('Campo Obrigatorio', 'Nome não informado');
      return false;
    }else if (this.profissional.senha == '' || this.profissional.senha == null) {
      this.showAlert('Campo Obrigatorio', 'Senha não informada');
      return false;
    }else if (this.profissional.email == '' || this.profissional.email == null) {
      this.showAlert('Campo Obrigatorio', 'Email não informado');
      return false;
    }else if (this.profissional.cep == '' || this.profissional.cep == null) {
      this.showAlert('Campo Obrigatorio', 'CEP não informado');
      return false;
    }else if (this.profissional.lograduro == '' || this.profissional.lograduro == null) {
      this.showAlert('Campo Obrigatorio', 'Logradouro não informado');
      return false;
    }else if (this.profissional.numero == '' || this.profissional.numero == null) {
      this.showAlert('Campo Obrigatorio', 'Numero não informado');
      return false;
    }else if (this.profissional.uf == '' || this.profissional.uf == null) {
      this.showAlert('Campo Obrigatorio', 'UF não informado');
      return false;
    }else if (this.profissional.cidade == '' || this.profissional.cidade == null) {
      this.showAlert('Campo Obrigatorio', 'Cidade não informada');
      return false;
    }else if (this.profissional.descricao == '' || this.profissional.descricao == null) {
      this.showAlert('Campo Obrigatorio', 'Descrição não informada');
      return false;
    }else if (this.profissional.contatos.length == 0) {
      this.showAlert('Campo Obrigatorio', 'Contatos não informados');
      return false;
    }else if (this.selectedServicos.length == 0) {
      this.showAlert('Campo Obrigatorio', 'Serviços não informados');
      return false;
    }else if (this.file == undefined) {
      this.showAlert('Campo Obrigatorio', 'Arquivo não informado');
      return false;
    }

    return true;
  }

  async cadastrarProfissional() {

    if (this.formValido()) {
      try {
        // Verifica o tipo de arquivo que foi passado, se for imagem, o tipo é image/png, se for pdf, o tipo é application/pdf
        const formData = new FormData();
        if (this.file)
          formData.append('file', this.file);

        this.profissional.tipoServicos = [];
        this.selectedServicos.forEach((item) => {
            this.profissional.tipoServicos.push(item);
          }
        );

        this.profissional.cep = this.profissional.cep.replace(/\D/g, '');

        // Transforma o profissional em um JSON
        formData.append('profissional', JSON.stringify(this.profissional));

        // Manda os dados para o backend,
        // Deve ser passado o objeto com os dados do profissional e o formData com o arquivo
        const response = await api.post('/create-profissional', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.navCtrl.navigateForward('/listar-profissional');
        this.showToast('Profissional cadastrado com sucesso', 'success');
      } catch (error) {
        if (error instanceof AxiosError){
          this.showToast(error.response?.data.message, 'danger');
          console.error(error.response?.data);
        }else {
          this.showToast('Erro ao cadastrar: '+error, 'danger');
          console.error(error);
        }
      }
    }

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



    onFileChange(fileChangeEvent: any) {
      // Verifica o tipo de arquivo que foi passado, se for imagem, o tipo é image/jpeg, se for pdf, o tipo é application/pdf
      if (!(fileChangeEvent.target.files[0].type === 'application/pdf') && !(fileChangeEvent.target.files[0].type === 'image/jpeg')) {
        this.file = undefined;
        fileChangeEvent.target.value = null;
        this.showAlert("Arquivos do Tipo Errado", "O arquivo deve ser do tipo PDF ou JPEG");
      } else {
        // Verifica o tamanho do arquivo, se for maior que 100MB, o arquivo é invalido
        if (fileChangeEvent.target.files[0].size > 100000000) {
          this.file = undefined;
          fileChangeEvent.target.value = null;
          this.showAlert("Arquivo Muito Grande", "O arquivo deve ter no máximo 50MB");

        } else {
          this.file = fileChangeEvent.target.files[0];
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

  // Contato
  adicionarContato() {
    if (this.contato && this.tipoContato) {

      if (this.tipoContato == 'E-mail') {
        this.contato = this.contato.toLowerCase();
        this.contato = this.contato.trim();

        if (this.contato.includes('@') && this.contato.includes('.')) {
          this.contatoValido = true;
        } else {
          this.showToast('E-mail inválido', 'danger');
          return;
        }
      } else if (this.tipoContato == 'Telefone' || this.tipoContato == 'Celular') {
        // Verifica se o telefone tem algum caractere que não seja numero ou + ou - ou ( ou )
        // E verica se o digitos do telefone é menor ou igual a 15
        this.contatoValido = !(this.contato.match(/[^0-9\+\-\(\)]/g) != null) && this.contato.length <= 20;
        if (!this.contatoValido) {
          this.showToast('Telefone inválido', 'danger');
          return;
        }
      }

      const novoContato = {
        contato: this.contato,
        tipoContato: this.tipoContato,
      };

      this.profissional.contatos.push(novoContato);
      this.contato = ''; // Limpe os campos após adicionar o contato
      this.tipoContato = ''; // Limpe o campo do tipo de contato
      this.contatoValido = false;
    }
  }

  removerContato(index: number) {
    this.profissional.contatos.splice(index, 1);

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

  // Servico
  private getServicosObs(term: any): Observable<any[]> {
    if (!term) {
      return of([]);
    }
    return of(this.tiposServicos.filter((v) => {
      return v.toLowerCase().indexOf(term.toLowerCase()) > -1;
    }).slice(0, 10));
  }

  // Validação
  verificarEmail() {
    this.profissional.email = this.profissional.email.toLowerCase();
    this.profissional.email = this.profissional.email.trim();

    if (this.profissional.email.includes('@') && this.profissional.email.includes('.')) {
      this.emailValido = true;
    } else {
      this.emailValido = false;
    }
  }



  // CEP

  async buscarCep() {
    const cep = this.profissional.cep.replace(/\D/g, '');
    // this.profissional.cep = this.profissional.cep.replace(/\D/g, '');
    console.log(this.profissional.cep);
    const cepEncontrado = await this.consultCepService.getCep(cep);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.profissional.cidade = cepEncontrado.city
      this.profissional.uf = cepEncontrado.state
      this.profissional.lograduro = cepEncontrado.street
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(cep);
      if (cepEncontrado2) {
        this.profissional.cidade = cepEncontrado2.cidade
        this.profissional.uf = cepEncontrado2.uf
        this.profissional.lograduro = cepEncontrado2.logradouro
        this.profissional.numero = cepEncontrado2.numero
        this.showToast('CEP encontrado', 'success');
      } else {
        this.profissional.cidade = ''
        this.profissional.uf = ''
        this.profissional.lograduro = ''
        this.profissional.numero = ''
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }

  // Navegação
  cancelar() {
    this.navCtrl.back();
  }
}
