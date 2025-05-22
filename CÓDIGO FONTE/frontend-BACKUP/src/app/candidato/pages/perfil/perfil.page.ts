import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import {CandidatoData} from "../../candidatoData";
import {Modalidade} from "../../../../../../shared/enums/Modalidade";
import {TipoVaga} from "../../../../../../shared/enums/TipoVaga";
import {Regime} from "../../../../../../shared/enums/Regime";
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  id: any = 0;
  userType: any = undefined;
  escolaridade: string = '';
  candidato: any;
  listaContatos: any[] = [];
  candidatoData = {
    nome: '',
    nomeSocial: '',
    cpf: '',
    email: '',
    senha: '',
    pretensaoSalarial: 0,
    cep: '',
    logradouro: '',
    numero: '',
    cidade: '',
    complemento: '',
    uf: '',
    contatos: [],
    dataNascimento: '',
    regimeInteresse: '',
    tipoVagaInteresse: '',
    cepInteresse: null,
    regiaoInteresse: false,
    cidadeInteresse: '',
    ufInteresse: '',
    genero: '',
    pcd: null,
    disponibilidade: '',
    nivelInstrucao: '',
    modalidadeInteresse: '',
    cnh: '',
    areas: '',
    curriculo: null,
    deletedAt: null,
    tipo: TipoUsuario.CANDIDATO

  }



  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'Desativar',
      role: 'confirm',
      handler: () => {
      },
    },
  ];


  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      console.log(params['id'])
      this.id = params['id'];
      this.userType = localStorage.getItem('userType');

      if (this.userType == TipoUsuario.CANDIDATO) {
        this.id = localStorage.getItem('userId');
      } else {
        this.navCtrl.back();
      }
      if (this.id == null || this.id == 0) {
        this.id = localStorage.getItem('userId');
      }
      this.carregarCandidatoPorId(this.id);

    });

  }


  async carregarCandidatoPorId(id: number) {
    try {
      // Caso tenha sido adicionado validaçao de token no backend, descomentar as linhas abaixo, e adiconar o header na requisiçao
      // const token = localStorage.getItem('token');
      // const headers = {
      //     'Authorization': `Bearer ${token}`
      // };
      const response = await api.get(`/find-candidato/${id}`);
      this.candidato = response.data;

      this.candidatoData.nome = this.candidato.nome;
      this.candidatoData.nomeSocial = this.candidato.nomeSocial;
      this.candidatoData.email = this.candidato.email;
      this.candidatoData.cpf = this.formatarCPF(this.candidato.cpf);
      this.candidatoData.pretensaoSalarial = this.formatarSalario(this.candidato.pretensaoSalarial);
      this.candidatoData.tipo = this.candidato.tipo;
      this.candidatoData.cep = this.formatarCep(this.candidato.cep);
      this.candidatoData.cidade = this.candidato.cidade;
      this.candidatoData.logradouro = this.candidato.logradouro;
      this.candidatoData.numero = this.candidato.numero;
      this.candidatoData.complemento = this.candidato.complemento;
      this.candidatoData.uf = this.candidato.uf;
      this.candidatoData.contatos = this.candidato.contatos;
      // Formata a data de nascimento para o formato dd/mm/aaaa
      this.candidatoData.dataNascimento = this.candidato.dataNascimento.split('-').reverse().join('/');
      this.candidatoData.regimeInteresse = this.candidato.regimeInteresse;
      this.candidatoData.tipoVagaInteresse = this.espacoVirgula(this.candidato.tipoVagaInteresse);
      this.candidatoData.cepInteresse = this.formatarCep(this.candidato.cepInteresse);
      this.candidatoData.regiaoInteresse = this.candidato.regiaoInteresse;
      this.candidatoData.ufInteresse = this.candidato.ufInteresse;
      this.candidatoData.cidadeInteresse = this.candidato.cidadeInteresse;
      this.candidatoData.genero = this.candidato.genero;
      this.candidatoData.pcd = this.candidato.pcd;
      this.candidatoData.disponibilidade = this.espacoVirgula(this.candidato.disponibilidade);
      this.candidatoData.nivelInstrucao = this.candidato.nivelInstrucao;
      this.candidatoData.modalidadeInteresse = this.espacoVirgula(this.candidato.modalidadeInteresse);
      this.candidatoData.cnh = this.candidato.cnh;
      this.candidatoData.areas = this.formatarArea(this.candidato.areas);

      await this.gerarEscolaridade();


    } catch (error) {
      console.error('Erro ao carregar o candidato:', error);
      this.showToast('Erro ao carregar o candidato', 'danger');
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

  async gerarEscolaridade() {

    console.log(this.candidatoData.pretensaoSalarial)

    if (this.candidatoData.nivelInstrucao == 'fudamentalI') {
      this.escolaridade = 'Ensino Fundamental Incompleto';
    }
    if (this.candidatoData.nivelInstrucao == 'fundamentalC') {
      this.escolaridade = 'Ensino Fundamental Completo';
    }
    if (this.candidatoData.nivelInstrucao == 'medioI') {
      this.escolaridade = 'Ensino Médio Incompleto';
    }
    if (this.candidatoData.nivelInstrucao == 'medioC') {
      this.escolaridade = 'Ensino Médio Completo';
    }
    if (this.candidatoData.nivelInstrucao == 'superiorI') {
      this.escolaridade = 'Ensino Superior Incompleto';
    }
    if (this.candidatoData.nivelInstrucao.includes ('superiorC')) {
      this.escolaridade = 'Ensino Superior Completo, ';

      if(this.candidatoData.nivelInstrucao.includes('especialização')){
        this.escolaridade += 'Especialização, ';
      }

      if(this.candidatoData.nivelInstrucao.includes('mestrado')){
        this.escolaridade += 'Mestrado, ';
      }

      if(this.candidatoData.nivelInstrucao.includes('doutorado')){
        this.escolaridade += 'Doutorado, ';
      }

      if(this.candidatoData.nivelInstrucao.includes('pós-doutorado')){
        this.escolaridade += 'Pós Doutorado, ';
      }

    }

    // Tira a ultima virgula
    if(this.escolaridade.slice(-2) == ', '){
      this.escolaridade = this.escolaridade.slice(0, -2);
    }
  }





  toEditar() {
    this.navCtrl.navigateForward(['/alterar-candidato'], {
      queryParams: {
        id: this.id
      }
    });
  }


  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    if (ev.detail.role === 'confirm') {
      this.deleteSelf();
    }
  }

  deleteSelf() {
    console.log('deleteSelf');
    const token = localStorage.getItem('token');

    if (!token) {
      this.showToast('Você precisa estar logado para deletar o candidato!', 'danger');
      return;
    }

    const id = this.id;

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return api.delete(`/delete-candidato/${id}`, {headers})

      .then((response) => {
        if (response.status === 200) {
          this.showToast('Candidato excluído com sucesso!', 'success');
          this.navCtrl.navigateRoot(['/login']);
        }
        localStorage.removeItem('token');
      })


  }

  protected readonly TipoUsuario = TipoUsuario;

  toAlterarSenha() {
    this.navCtrl.navigateForward(['/new-password-candidato']);
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

  private formatarCPF(cpf: any) {
    if(cpf.length < 11){
      // Adiciona 0 no inicio até completar 11 caracteres
      while(cpf.length < 11){
        cpf = '0' + cpf;
      }
    }
    if (cpf) {
      cpf = cpf.toString().replace(/\D/g, '');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      return cpf;
    }
  }

  private formatarCep(cep: any) {
    if (cep) {
      cep = cep.toString().replace(/\D/g, '');
      cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
      return cep;
    }
  }

  espacoVirgula(str: string) {
    if (str) {
      str = str.toString().replace(/,/g, ', ');
      return str;
    }
    return '';
  }

  formatarArea(areas: any) {
    if (areas) {
      areas = this.espacoVirgula(areas);

      // Tira a ultima virgula
      areas = areas.trim();
      if(areas.slice(-1) == ','){
        areas = areas.slice(0, -1);
      }

      return areas;
    }
  }
}
