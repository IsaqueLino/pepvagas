import { Component, OnInit } from '@angular/core';
import {ProfissionalLiberalData} from "../../profissionalLiberalData";
import {ActivatedRoute} from "@angular/router";
import {NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {

  img: any = undefined;
  pdfSrc: any = undefined;

  tamanho: any = 0;

  id: any = 0;
  profissional: any;
  servicos: any;
  profissionalData: ProfissionalLiberalData = {
    nome: '',
    senha: '',
    email: '',
    tipo: '',
    cep: '',
    cidade: '',
    uf: '',
    lograduro: '',
    numero: '',
    complemento: '',
    descricao: '',
    tipoServicos: [],
    contatos: [],
    arquivoPDF: undefined,
    arquivoIMG: undefined


  }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id == null || this.id == 0) {
        this.id = localStorage.getItem('userId');
      }
      this.carregarCandidatoPorId(this.id);
    });
  }


  async carregarCandidatoPorId(id: number) {
    try {
      const response = await api.get(`/find-profissional/${id}`); // Substitua '/find' pela rota real em seu servidor
      this.profissional = response.data;

      this.profissionalData.nome = this.profissional.nome;
      this.profissionalData.email = this.profissional.email;
      this.profissionalData.tipo = this.profissional.tipo;
      this.profissionalData.cep = this.profissional.cep;
      this.profissionalData.cidade = this.profissional.cidade;
      this.profissionalData.uf = this.profissional.uf;
      this.profissionalData.lograduro = this.profissional.logradouro;
      this.profissionalData.numero = this.profissional.numero;
      this.profissionalData.complemento = this.profissional.complemento;
      this.profissionalData.descricao = this.profissional.descricao;
      this.profissionalData.tipoServicos = this.profissional.tipoServicos;
      console.log(this.profissionalData.tipoServicos)
      this.profissionalData.contatos = this.profissional.contatos;

      await api.get(`/find-file/${id}`).then(
        (response) => {
          let data = response.data;
          const headers = response.headers;
          const status = response.status;

          if (status === 201)
            this.pdfSrc = {data: this.base64ToArrayBuffer(data)};
          else
            this.img = "data:image/jpeg;base64," + data;

        }
      ).catch((error) => {
        console.log('error:', error)
        this.showToast('Erro ao carregar o arquivo', 'danger');
      });
    } catch (error) {
      console.error('Erro ao carregar o profissional:', error);
      this.showToast('Erro ao carregar o profissional', 'danger');
    }
  }

  base64ToArrayBuffer(base64: any) {
    // Precisa aceitar caracteres especiais brasileiros
    const cleanBase64 = base64.replace(/\s/g, '').replace(/=+$/, '');

    let binary_string = window.atob(cleanBase64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
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


  protected readonly undefined = undefined;
}
