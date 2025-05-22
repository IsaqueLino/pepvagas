import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertButton, AlertController, NavController, ToastController } from '@ionic/angular';
import { api } from 'src/app/services/axios';
import { MaskService } from 'src/app/services/mask.service';
import { AxiosError } from "axios";
import { CEP, VagaData } from '../../vagaData';
import { ConsultCepService } from 'src/app/services/consult.cep';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-alterar-vaga',
  templateUrl: './alterar-vaga.page.html',
  styleUrls: ['./alterar-vaga.page.scss'],
})
export class AlterarVagaPage implements OnInit {
  idVaga: number = 0;
  dataAtual = new Date();
  vaga: VagaData = {
    titulo_vaga: '',
    tipo_vaga: '',
    regime: '',
    modalidade: '',
    descricao: '',
    salario: 0,
    cep: '',
    cidade: '',
    logradouro: '',
    numero: '',
    complemento: '',
    uf: '',
    pcd: 0,
    data_limite: new Date(),
    imagem: null,
    cnh: '',
    site: '',
    email_curriculo: '',
    contato: '',
    idAdministrador: 0,
    idEquipe: 0,
    idArea: 0,
    idEmpresa: 0,
    idRepresentante: 0,
    candidatos: [],
  };


  area: any = {};
  userType: any;
  titulo_vagaNovo = '';
  tipo_vagaNovo = '';
  regimeNovo = '';
  modalidadeNovo = '';
  descricaoNovo = ''
  idAreaNovo: number = 0;
  salarioNovo = 0
  cepNovo = ''
  cidadeNovo = ''
  logradouroNovo = ''
  numeroNovo = ''
  complementoNovo = ''
  siteNovo = ''
  ufNovo = ''
  pcdNovo = 0
  cnhNovo = ''
  contatoNovo = ''
  email_curriculoNovo = ''
  data_limiteNovo = new Date()
  fileImage: any;

  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
  areas: any[] = [];
  temCandidatos: boolean = false;
  public emailValido = true;

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    public maskService: MaskService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private consultCepService: ConsultCepService,
    private http: HttpClient
  ) {
    this.userType = localStorage.getItem('userType');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idVaga = params['idVaga'];
      this.carregarVagaPorId(this.idVaga);
      this.carregarListaAreas();
    });
  }

  onFileChange(event: any) {

    if(!event.target.files[0].type.includes('image')){
      this.fileImage = null;
      event.target.value = null;
      this.showToast('Formato de arquivo inválido', 'danger');
      return;
    }
    
    else if (event.target.files[0].size > 5000000) {
      this.fileImage = null;
      event.target.value = null;
      this.showToast('Imagem muito grande', 'danger');
      return;
    } else {
      this.fileImage = event.target.files[0];
      console.log(this.fileImage);
    }

  }

  carregarListaAreas() {
    api.get('/list-areas')
      .then(response => {
        this.areas = response.data;
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  compareDates(date1: Date, date2: Date): boolean {
    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000; // Número de milissegundos em um dia
    const umDiaAntesDaDataAtual = new Date(date2).getTime() - umDiaEmMilissegundos;
    return new Date(date1) < new Date(umDiaAntesDaDataAtual);
  }

  async carregarVagaPorId(idVaga: number) {
    try {
      const responseVaga = await api.get(`/find-vaga/${idVaga}`);
      this.vaga = responseVaga.data;
      console.log('Vaga encontrada:',this.vaga);
      if(this.vaga.candidatos && this.vaga.candidatos.length > 0){
        this.temCandidatos = true;
      }

      this.titulo_vagaNovo = this.vaga.titulo_vaga;
      this.tipo_vagaNovo = this.vaga.tipo_vaga;
      this.regimeNovo = this.vaga.regime;
      this.modalidadeNovo = this.vaga.modalidade;
      this.siteNovo = this.vaga.site;
      this.descricaoNovo = this.vaga.descricao;
      this.idAreaNovo = this.vaga.idArea;
      this.salarioNovo = this.vaga.salario;

      this.cepNovo = this.vaga.cep.toString().replace(/^(\d{5})(\d{3})$/, '$1-$2');

      this.cidadeNovo = this.vaga.cidade;
      this.logradouroNovo = this.vaga.logradouro;
      this.numeroNovo = this.vaga.numero;
      this.complementoNovo = this.vaga.complemento;
      this.ufNovo = this.vaga.uf;
      this.pcdNovo = this.vaga.pcd;
      this.cnhNovo = this.vaga.cnh;
      this.contatoNovo = this.vaga.contato;
      this.email_curriculoNovo = this.vaga.email_curriculo;
      this.data_limiteNovo = this.vaga.data_limite;

    } catch (error) {
      console.error('Erro ao carregar a vaga:', error);
      this.showToast('Erro ao carregar a vaga', 'danger');
    }
  }

  async formValido() {
    if (this.titulo_vagaNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Título da vaga não informado.')
      return false;
    } else if (this.tipo_vagaNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Tipo da vaga não informado.')
      return false;
    } else if (this.tipo_vagaNovo=='Emprego' && this.regimeNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Regime da vaga não informado.')
      return false;
    } else if (this.modalidadeNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Modalidade da vaga não informada.')
      return false;
    } else if (this.descricaoNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Descrição da vaga não informado.')
      return false;
    } else if (this.idAreaNovo == 0) {
      this.showAlert('Campos Obrigatórios', 'Área de Atuação não informada.')
      return false;
    } else if (this.salarioNovo == 0) {
      this.showAlert('Campos Obrigatórios', 'Salário da vaga não informado.')
      return false;
    } else if (this.cepNovo == '') {
      this.showAlert('Campos Obrigatórios', 'CEP da vaga não informado.')
      return false;
    } else if (this.logradouroNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Logradouro não informado.')
      return false;
    } else if (this.numeroNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Número não informado.')
      return false;
    } else if (this.ufNovo == '') {
      this.showAlert('Campos Obrigatórios', 'UF não informada.')
      return false;
    } else if (this.cnhNovo == '') {
      this.showAlert('Campos Obrigatórios', 'Informe sobre a CNH.')
      return false;
    } else if (this.data_limiteNovo == null) {
      this.showAlert('Campos Obrigatórios', 'Data Limite da vaga não informada.')
      return false;
    } else if (this.userType == 'Representante' && this.vaga.email_curriculo == null) {
      this.showAlert('Campos Obrigatórios', 'Informe o email que receberá os currículos.')
      return false;
    } else if (this.compareDates(this.vaga.data_limite, this.dataAtual)) {
      this.showAlert('Campos Obrigatórios', 'Data Limite da vaga não pode ser menor que a data atual.')
      return false;
    }
    else {
      if (this.tipo_vagaNovo !== 'Emprego' && this.regimeNovo) {
        this.regimeNovo = '';
      }
      return true;
    }
  }

  async buscarCep() {
    this.cepNovo = this.cepNovo.replace(/\D/g, '');
    console.log(this.cepNovo);
    const cepEncontrado = await this.consultCepService.getCep(this.cepNovo);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.cidadeNovo = cepEncontrado.city
      this.ufNovo = cepEncontrado.state
      this.logradouroNovo = cepEncontrado.street
      this.showToast('CEP encontrado', 'success');
    } else {
        const cepEncontrado2 = await this.consultCepService.getCep2(this.cepNovo);
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

  async retirarMascara() {
    const cepRegex = /[^0-9]/g;
    this.cepNovo = this.cepNovo.replace(cepRegex, '');
    this.cepNovo = this.cepNovo.replace(/[^\d]/g, '');
  }


  async alterarVaga() {
    if (await this.formValido()) {
      await this.retirarMascara();
      console.log(this.vaga);
      try {

        const formData = new FormData();
        if(this.fileImage){
          formData.append('file', this.fileImage);
          console.log('imagem adicionada');

        }

        
        const alterData = {
          idVaga: this.idVaga,
          titulo_vaga: this.titulo_vagaNovo,
          tipo_vaga: this.tipo_vagaNovo,
          regime: this.regimeNovo,
          modalidade: this.modalidadeNovo,
          descricao: this.descricaoNovo,
          idArea: this.idAreaNovo,
          salario: this.salarioNovo,
          cep: this.cepNovo,
          cidade: this.cidadeNovo,
          logradouro: this.logradouroNovo,
          site: this.siteNovo,
          numero: this.numeroNovo,
          complemento: this.complementoNovo,
          uf: this.ufNovo,
          pcd: this.pcdNovo,
          cnh: this.cnhNovo,
          contato: this.contatoNovo,
          email_curriculo: this.email_curriculoNovo,
          data_limite: this.data_limiteNovo,
        };
        formData.append('vaga', JSON.stringify(alterData));
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!token) {
          this.showToast('Você precisa estar logado para alterar a vaga!', 'danger');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await api.put(`/update-vaga`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Dados enviados:', alterData);
        try {
          await api.post('/create-cep', { cep: this.cepNovo, uf: this.ufNovo, cidade: this.cidadeNovo, logradouro: this.logradouroNovo, numero: this.numeroNovo });
        } catch (cepError: any) {
          // Ignorar erros relacionados ao CEP
          if (cepError.response.status !== 400 || cepError.config.url !== '/create-cep') {
            throw cepError; // Lança o erro se não for relacionado ao CEP
          }
        }
        
        if (response.status === 200) {
          this.showToast('Vaga alterada com sucesso!', 'success');
          this.navCtrl.navigateRoot('/listar-vaga');
        }
      }  catch (error:any) {
        if (error.response.status === 400) {
          this.showToast('Esta vaga já foi publicada', 'danger');
        } else {
          console.log(error);
          this.showToast('Erro ao cadastrar a Vaga', 'danger');
        } 
      }
    }
  }


  navegarParaListarCandidatos(idVaga: number) {
    this.navCtrl.navigateForward('/lista-candidatos', {
      queryParams: {
        "idVaga": idVaga
      }
    });
  }

  verificarEmail(): void {
    this.email_curriculoNovo = this.email_curriculoNovo.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValido = emailRegex.test(this.email_curriculoNovo);
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

  cancelar(){
    this.navCtrl.pop();
  }
}
