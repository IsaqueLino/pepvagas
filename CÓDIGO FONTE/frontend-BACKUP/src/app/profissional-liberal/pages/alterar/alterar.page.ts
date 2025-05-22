import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AlertController, NavController, PopoverController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import {PopoverSelectComponent} from "../../../candidato/pages/cadastro/popover-select/popover-select.component";
import {distinctUntilChanged, Observable, of, Subject, switchMap, tap} from "rxjs";
import {AxiosError} from "axios";
import {MaskService} from "../../../services/mask.service";
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";
import {ConsultCepService} from "../../../services/consult.cep";

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.page.html',
  styleUrls: ['./alterar.page.scss'],
})
export class AlterarPage implements OnInit {

  tipoUsuario : any;
  idUsuario : any;

  contato: string = '';

  tipoContato: string = '';

  file : any | null= null;

  id: number = 0;
  profissional: any;
  profissionalData: any = {
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

  tiposServicos: any[] = [];

  servicos$: Observable<any[]> = new Observable<any[]>();
  servicosLoading = false;
  servicosInput$ = new Subject<string>();
  selectedServicos: any[] = <any>[];

  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  public checkSenha: string = '';

  public type = 'password';
  public showPass = false;
  public emailValido = true;
  public nomeValido = false;
  public contatoValido = false;

  senhaRequisitos = {
    lengthCheck: false,
    upperLowerCheck: false,
    numberCheck: false,
    specialCharCheck: false
  };

  customCounterFormatter(inputLenght: number, maxLength: number) {
    return 'Restam ' + (maxLength - inputLenght) + ' caracteres';
  }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private alertController: AlertController,
    public maskService: MaskService,
    private consultCepService: ConsultCepService,
  ) {
  }

  ngOnInit() {
    this.tipoUsuario = localStorage.getItem('userType');
    this.idUsuario = localStorage.getItem('userId');
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if(this.tipoUsuario == null || this.idUsuario == null){
        this.navCtrl.navigateRoot('/login');
      }else if(this.idUsuario != this.id && this.tipoUsuario != TipoUsuario.ADMINISTRADOR){
        this.navCtrl.navigateForward('/alterar-profissional/'+this.idUsuario);
      }
      this.carregarProfissionalPorId(this.id);
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

  async getServicos() {


    api.get('/list-tipo-servicos').then((response) => {
        let data = response.data;

        for (let i = 0; i < data.length; i++) {
          this.tiposServicos.push(data[i].nome);
        }


      }
    ).catch((error) => {
      this.showToast('Erro ao carregar os tipos de serviços', 'danger');
      console.error(error);
    });
  }


  async carregarProfissionalPorId(id: number) {
    try {
      const response = await api.get(`/find-profissional/${id}`);
      this.profissional = response.data;

      this.profissionalData.nome = this.profissional.nome;
      this.profissionalData.sobrenome = this.profissional.sobrenome;
      this.profissional.cep = this.formatarCep(this.profissional.cep);
      this.profissionalData.cep = this.profissional.cep;
      this.profissionalData.email = this.profissional.email;
      this.profissionalData.servico = this.profissional.servico;
      this.profissionalData.descricao = this.profissional.descricao;
      this.profissionalData.contatos = this.profissional.contatos;
      this.profissionalData.tipo = this.profissional.tipo;
      this.profissionalData.uf = this.profissional.uf;
      this.profissionalData.cidade = this.profissional.cidade;
      this.profissionalData.logradouro = this.profissional.logradouro;
      this.profissionalData.numero = this.profissional.numero;
      this.profissionalData.complemento = this.profissional.complemento;
      this.profissionalData.arquivoPDF = this.profissional.arquivoPDF;
      this.profissionalData.arquivoIMG = this.profissional.arquivoIMG;

      this.selectedServicos = this.profissional.tipoServicos.map((tipoServico: any) => {
        return tipoServico.nome;
      });


    } catch (error) {
     if(error instanceof AxiosError) {
       this.showToast(error.response?.data.message, 'danger');
       console.error(error.response?.data);
     }else {
        this.showToast('Erro ao carregar profissional: '+error, 'danger');
        console.error(error);
     }
    }
  }



  alterarProfisional() {
    try {
      const dadosDeAlteracao = {
        nome: this.profissionalData.nome,
        sobrenome: this.profissionalData.sobrenome,
        cep: this.profissionalData.cep.replace(/\D/g, '').trim(),
        email: this.profissionalData.email,
        senha: this.profissionalData.senha,
        servico: this.profissionalData.servico,
        descricao: this.profissionalData.descricao,
        contatoes: this.profissionalData.contatos,
        tipo: this.profissionalData.tipo,
        uf: this.profissionalData.uf,
        cidade: this.profissionalData.cidade,
        logradouro: this.profissionalData.logradouro,
        numero: this.profissionalData.numero,
        complemento: this.profissionalData.complemento,
        tipoServicos: this.selectedServicos,

      };

      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('profissional', JSON.stringify(dadosDeAlteracao));

      const response = api.put(`/update-profissional/${this.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      this.showToast('Profissional alterado com sucesso', 'success');

      this.navCtrl.back();


    } catch (error) {
      if(error instanceof AxiosError){
        this.showToast(error.response?.data.message, 'danger');
        console.error(error.response?.data);
      }else {
        this.showToast('Erro ao alterar: '+error, 'danger');
        console.error(error);
      }
    }
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

  trackByFn(item: any) {
    return item.id;
  }

  private getServicosObs(term: any): Observable<any[]> {
    if (!term) {
      return of([]);
    }
    return of(this.tiposServicos.filter((v) => {
      return v.toLowerCase().indexOf(term.toLowerCase()) > -1;
    }).slice(0, 10));
  }

  adicionarContato() {

    if (this.contato && this.tipoContato) {
      const novoContato = {
        contato: this.contato,
        tipoContato: this.tipoContato,
      };

      this.profissionalData.contatos.push(novoContato);
      this.contato = '';
      this.tipoContato = '';
    }

  }

  removerContato(index: number) {
    this.profissionalData.contatos.splice(index, 1);
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


  onFileChange(fileChangeEvent: any) {
    if (!(fileChangeEvent.target.files[0].type === 'application/pdf') && !(fileChangeEvent.target.files[0].type === 'image/jpeg')) {
      this.file = undefined;
      fileChangeEvent.target.value = null;
      this.showAlert("Arquivos do Tipo Errado","O arquivo deve ser do tipo PDF ou JPEG");
    } else {
      if (fileChangeEvent.target.files[0].size > 100000000) {
        this.file = undefined;
        fileChangeEvent.target.value = null;
        this.showAlert("Arquivo Muito Grande","O arquivo deve ter no máximo 50MB");

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

  private formatarCep(cep:any) {
    if (cep) {
      cep = cep.toString().replace(/\D/g, '');
      cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
      return cep;
    }
  }


  verificarEmail() {

    this.profissionalData.email = this.profissionalData.email.toLowerCase();
    this.profissionalData.email = this.profissionalData.email.trim();

    if (this.profissionalData.email.includes('@') && this.profissionalData.email.includes('.')) {
      this.emailValido = true;
    } else {
      this.emailValido = false;
    }

  }

  cancelar() {
    this.navCtrl.back();
  }



  async buscarCep() {
    const cep = this.profissionalData.cep.replace(/\D/g, '');
    // this.profissional.cep = this.profissional.cep.replace(/\D/g, '');
    console.log(this.profissionalData.cep);
    const cepEncontrado = await this.consultCepService.getCep(cep);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.profissionalData.cidade = cepEncontrado.city
      this.profissionalData.uf = cepEncontrado.state
      this.profissionalData.lograduro = cepEncontrado.street
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(cep);
      if (cepEncontrado2) {
        this.profissionalData.cidade = cepEncontrado2.cidade
        this.profissionalData.uf = cepEncontrado2.uf
        this.profissionalData.lograduro = cepEncontrado2.logradouro
        this.profissionalData.numero = cepEncontrado2.numero
        this.showToast('CEP encontrado', 'success');
      } else {
        this.profissionalData.cidade = this.profissional.cidade
        this.profissionalData.uf = this.profissional.uf
        this.profissionalData.lograduro = this.profissional.logradouro
        this.profissionalData.numero = this.profissional.numero
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  verificarRequisitosSenha(): void {
    this.senhaRequisitos.lengthCheck = this.profissionalData.senha.length >= 6;
    this.senhaRequisitos.upperLowerCheck = /[a-z]/.test(this.profissionalData.senha) && /[A-Z]/.test(this.profissionalData.senha);
    this.senhaRequisitos.numberCheck = /[0-9]/.test(this.profissionalData.senha);
    this.senhaRequisitos.specialCharCheck = /[!@#$%^&*(){}ç_,"+-]/.test(this.profissionalData.senha);
  }
}
