import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AlertController, NavController, ToastController} from "@ionic/angular";
import {api} from "../../../services/axios";
import {ProfissionalLiberalData} from "../../profissionalLiberalData";
import {TipoUsuario} from "../../../../../../shared/enums/TipoUsuario";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  img: any = undefined;
  pdfSrc: any = undefined;

  userType: any;


  tamanho: any = 0;

  id: any = 0;
  profissional: any;
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

  endereco: string = '';
  servicos: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
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
    this.userType = localStorage.getItem('userType');

  }


  async carregarCandidatoPorId(id: number) {
    try {
      const response = await api.get(`/find-profissional/${id}`);
      this.profissional = response.data;

      this.profissionalData.nome = this.profissional.nome;
      this.profissionalData.email = this.profissional.email;
      this.profissionalData.tipo = this.profissional.tipo;
      this.profissionalData.cep = this.formatarCep(this.profissional.cep);
      this.profissionalData.cidade = this.profissional.cidade;
      this.profissionalData.uf = this.profissional.uf;
      this.profissionalData.lograduro = this.profissional.logradouro;
      this.profissionalData.numero = this.profissional.numero;
      this.profissionalData.complemento = this.profissional.complemento;
      this.profissionalData.descricao = this.profissional.descricao;

      this.endereco = this.profissionalData.lograduro + ', ' + this.profissionalData.numero + ' - ' + this.profissionalData.cidade + ' - ' + this.profissionalData.uf;

      if (this.profissional.tipoServicos == null || this.profissional.tipoServicos.length == 0) {
        this.servicos = 'Nenhum serviço cadastrado';
        this.tamanho = 1;
      } else {
        // Faz a listagem dos serviços, separando por vírgula
        this.servicos = this.profissional.tipoServicos[0].nome;
        for (let i = 1; i < this.profissional.tipoServicos.length; i++) {
          this.servicos += ', ' + this.profissional.tipoServicos[i].nome;
        }
        this.tamanho = this.profissional.tipoServicos.length;
      }
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
        this.showToast('Erro ao carregar a imagem', 'danger');
        console.log('error:', error)
      });
    } catch (error) {
      console.error('Erro ao carregar o profissional:', error);
      this.showToast('Erro ao carregar o administrador', 'danger');
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

  private formatarCep(cep:any) {
    if (cep) {
      cep = cep.toString().replace(/\D/g, '');
      cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
      return cep;
    }
  }

  toEditar() {
    this.navCtrl.navigateForward('/alterar-profissional',{
      queryParams: {
        id: this.id
      }
    });
  }

  toAlterarSenha() {
    this.navCtrl.navigateForward('/new-password-profissional',{
    });
  }

  protected readonly TipoUsuario = TipoUsuario;

  async toExluir() {

    if(this.userType == TipoUsuario.LIBERAL)
      this.id = localStorage.getItem('userId');
    else
      return;

    const alert = await this.alertController.create({
      header: 'Desativar Conta',
      message: 'Voce tem certeza que deseja desativar sua conta? Uma vez desativada, ela podera ser recuperada fazendo login novamente.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Desativação cancelada');
          },
        },
        {
          text: 'Desativar',
          handler: () => {
            // Faça a solicitação de exclusão do administrador com o ID especificado
            api.delete(`/delete-profissional/${this.id}`)
              .then(response => {
                // Atualize a lista de administradores após a exclusão
                this.showToast('Conta desativada.', 'success');
                localStorage.clear();
                this.navCtrl.navigateRoot('/home');
              })
              .catch(error => {
                // Lidar com erros aqui
                console.error('Erro ao desativar o profissional:', error);
                this.showToast(`Erro ao desativar o  profissional: ${error}`, 'danger');
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
