import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-descricao',
  templateUrl: './descricao.page.html',
  styleUrls: ['./descricao.page.scss'],
})
export class DescricaoPage implements OnInit {

  pdfSrc: any | undefined = undefined;
  img: any;
  id: number = 0;
  profissional: any;
  profissionalData: any = {
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    tipo: '',
    cep: '',
    cidade: '',
    estado: '',
    logradouro: '',
    numero: '',
    complemento: '',
    servicos: [],
    descricao: '',
    contato: '',
    arquivoPdf: '',
    arquivoImagem: '',

  }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.carregarCandidatoPorId(this.id);
    });
  }


  async carregarCandidatoPorId(id: number) {
    try {
      const response = await api.get(`/find-profissional/${id}`); // Substitua '/find' pela rota real em seu servidor
      this.profissional = response.data;

      this.profissionalData.nome = this.profissional.nome;
      this.profissionalData.sobrenome = this.profissional.sobrenome;
      this.profissionalData.email = this.profissional.email;
      //this.candidatoData.senha = this.candidato.senha;
      this.profissionalData.tipo = this.profissional.tipo;
      this.profissionalData.cep = this.profissional.cep;
      this.profissionalData.cidade = this.profissional.cidade;
      this.profissionalData.estado = this.profissional.estado;
      this.profissionalData.logradouro = this.profissional.logradouro;
      this.profissionalData.numero = this.profissional.numero;
      this.profissionalData.complemento = this.profissional.complemento;
      this.profissionalData.servicos = this.profissional.tipoServicos;
      this.profissionalData.descricao = this.profissional.descricao;
      this.profissionalData.contatos = this.profissional.contatos;


      let file = null;

      const responseFile = await api.get(`/find-file/${id}`).then(
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
        this.showToast('Erro ao carregar o arquivo', 'danger');
        console.log('error:', error)
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

  navHome() {
    this.navCtrl.navigateRoot('/home');
  }
}
