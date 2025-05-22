import { Component, OnInit } from '@angular/core';
import {CandidatoData} from "../../candidatoData";
import {TipoVaga} from "../../../../../../shared/enums/TipoVaga";
import {Modalidade} from "../../../../../../shared/enums/Modalidade";
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";
import {ActivatedRoute} from "@angular/router";
import {NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {
  id: any = 0;
  escolaridade: string = '';
  pcd: string = '';
  candidato: any;
  listaContatos: any[] = [];
  candidatoData: any = {
    nome: '',
    nomeSocial: '',
    cpf: '',
    email: '',
    senha: '',
    pretensaoSalarial: '',
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
    cepInteresse: '',
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

  pos : string = '';
  valorACombinar : boolean = false;
  areas : string = '';

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
      this.carregarCandidatoPorId(this.id);
    });

  }


  async carregarCandidatoPorId(id: number) {
    try {
      const response = await api.get(`/find-candidato/${id}`);
      this.candidato = response.data;

      this.candidatoData.nome = this.candidato.nome;
      this.candidatoData.nomeSocial = this.candidato.nomeSocial;
      this.candidatoData.cpf = this.formatarCPF(this.candidato.cpf);
      this.candidatoData.pretensaoSalarial = this.formatarSalario(this.candidato.pretensaoSalarial);
      this.candidatoData.email = this.candidato.email;
      this.candidatoData.tipo = this.candidato.tipo;
      this.candidatoData.cep = this.formatarCep(this.candidato.cep);
      this.candidatoData.cidade = this.candidato.cidade;
      this.candidatoData.logradouro = this.candidato.logradouro;
      this.candidatoData.numero = this.candidato.numero;
      this.candidatoData.complemento = this.candidato.complemento;
      this.candidatoData.uf = this.candidato.uf;
      this.candidatoData.contatos = this.candidato.contatos;
      this.candidatoData.dataNascimento = this.candidato.dataNascimento;
      this.candidatoData.regimeInteresse = this.candidato.regimeInteresse;
      this.candidatoData.tipoVagaInteresse = this.candidato.tipoVagaInteresse;
      this.candidatoData.cepInteresse = this.formatarCep(this.candidato.cepInteresse);
      this.candidatoData.regiaoInteresse = this.candidato.regiaoInteresse;
      this.candidatoData.ufInteresse = this.candidato.ufInteresse;
      this.candidatoData.cidadeInteresse = this.candidato.cidadeInteresse;
      this.candidatoData.genero = this.candidato.genero;
      this.candidatoData.pcd = this.candidato.pcd;
      this.candidatoData.disponibilidade = this.candidato.disponibilidade;
      this.formatarEscolaridade(this.candidato.nivelInstrucao);
      this.candidatoData.modalidadeInteresse = this.candidato.modalidadeInteresse;
      this.candidatoData.cnh = this.candidato.cnh;
      this.gerarAreas(this.candidato.areas);

      if (this.candidatoData.pcd) {
        this.pcd = 'Sim';
      } else {
        this.pcd = 'Não';
      }


    } catch (error) {
      console.error('Erro ao carregar o administrador:', error);
      this.showToast('Erro ao carregar o administrador', 'danger');
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

  /**
   * Vai formatar o texto para que fique com espaco entre as virgulas
   * @param texto
   */
  async arrumarVigula(texto : string){
    texto = texto.trim();
    // Tira a virgula do final
    if(texto.endsWith(',')){
      texto = texto.substring(0, texto.length - 1);
    }

    // Adiciona espaco entre as virgulas
    texto = texto.replace(/,/g, ', ');
    return texto;

  }

  gerarAreas(areas: any) {
    this.areas = areas.trim();
    // Tira a virgula do final
    if (this.areas.endsWith(',')) {
      this.areas = this.areas.substring(0, this.areas.length - 1);
    }


  }
  async formatarEscolaridade(nivelInstrucao: any) {

    // Gerar a pos graduação
    if (nivelInstrucao.includes('especialização')) this.pos = 'Especialização';
    if (nivelInstrucao.includes('mestrado')) this.pos = 'Mestrado';
    if (nivelInstrucao.includes('doutorado')) this.pos = 'Doutorado';
    if (nivelInstrucao.includes('pós-doutorado')) this.pos = 'Pós-doutorado';


    // Gerar a escolaridade
    if (nivelInstrucao == 'fundamentalI') this.escolaridade = 'Ensino Fundamental Incompleto';
    if (nivelInstrucao == 'fundamentalC') this.escolaridade = 'Ensino Fundamental Completo';
    if (nivelInstrucao == 'medioI') this.escolaridade = 'Ensino Médio Incompleto';
    if (nivelInstrucao == 'medioC') this.escolaridade = 'Ensino Médio Completo';
    if (nivelInstrucao == 'superiorI') this.escolaridade = 'Ensino Superior Incompleto';
    if (nivelInstrucao == 'superiorC') this.escolaridade = 'Ensino Superior Completo';


  }

  private formatarSalario(pretensaoSalarial: any) {
    if (pretensaoSalarial != null) {
      console.log(pretensaoSalarial)

      if (pretensaoSalarial < 1) {
        return 'Valor a combinar';
      }

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

}
