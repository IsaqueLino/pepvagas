import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform, PopoverController, ToastController } from "@ionic/angular";
import { api } from 'src/app/services/axios';
import { FormGroup } from '@angular/forms';
import { MaskService } from 'src/app/services/mask.service';
import { AxiosError } from 'axios';
import { VagaData } from '../../vagaData';
import { AuthService } from 'src/app/services/auth.service';
import { ConsultCepService } from 'src/app/services/consult.cep';
import * as Yup from 'yup';
@Component({

  selector: 'app-cadastro-vaga',
  templateUrl: './cadastro-vaga.page.html',
  styleUrls: ['./cadastro-vaga.page.scss'],
})
export class CadastroVagaPage implements OnInit {

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
    complemento: '',
    numero: '',
    uf: '',
    pcd: 0,
    data_limite: new Date(),
    cnh: '',
    imagem: null,
    email_curriculo: '',
    contato: '',
    site: '',
    idAdministrador: 0,
    idEquipe: 0,
    idArea: 0,
    idEmpresa: 0,
    idRepresentante: 0
  };


  ceps = [{
    cep: 0,
    cidade: '',
    uf: '',
    logradouro: '',
    numero: '',
  }];

  areas: any[] = [];
  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA',
    'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  userId: any;
  representante: any = {};
  userType: any = ''
  dataAtual = new Date();
  fileImage: any;
  public emailValido = false;

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    public maskService: MaskService,
    private popoverController: PopoverController,
    private alertController: AlertController,
    public platform: Platform,
    private consultCepService: ConsultCepService,
  ) {
    this.userType = localStorage.getItem('userType');
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

  removerImagem(id: number) {
    this.fileImage = null;
    this.showToast('Imagem removida', 'success');
  }

  customCounterFormatter(inputLenght: number, maxLength: number) {
    return 'Restam ' + (maxLength - inputLenght) + ' caracteres';
  }

  compareDates(date1: Date, date2: Date): boolean {
    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000; // Número de milissegundos em um dia
    const umDiaAntesDaDataAtual = new Date(date2).getTime() - umDiaEmMilissegundos;
    return new Date(date1) < new Date(umDiaAntesDaDataAtual);
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');

    //formata a data para o formato do input date
    this.dataAtual.setDate(this.dataAtual.getDate() + 1);
    this.vaga.data_limite = this.dataAtual;

    if (localStorage.getItem('userType') == 'Equipe') {
      this.vaga.idEquipe = parseInt(this.userId, 10);
    }

    if (localStorage.getItem('userType') == 'Administrador') {
      this.vaga.idAdministrador = parseInt(this.userId, 10);
    }

    if (localStorage.getItem('userType') == 'Representante') {
      const response = await api.get(`/find-representante/${this.userId}`);
      this.representante = response.data;
      this.userId = this.representante.idRepresentante;
      this.vaga.idEmpresa = parseInt(this.representante.idEmpresa, 10);
      this.vaga.idRepresentante = parseInt(this.userId, 10);
    }

    await api.get('/list-areas')
      .then(response => {
        this.areas = response.data;
      })
      .catch(error => {
        console.error('Erro:', error);
      });

    await api.get('/list-ceps').then((response) => {
      let data = response.data;
      this.ceps = data.map((cep: any) => {
        return cep;
      }
      );
    }
    ).catch((error) => {
      console.log(error);
    }
    );
  }

  async buscarCep() {
    this.vaga.cep = this.vaga.cep.replace(/\D/g, '');
    console.log(this.vaga.cep);
    const cepEncontrado = await this.consultCepService.getCep(this.vaga.cep);
    console.log(cepEncontrado);
    if (cepEncontrado) {
      this.vaga.cidade = cepEncontrado.city
      this.vaga.uf = cepEncontrado.state
      this.vaga.logradouro = cepEncontrado.street
      this.showToast('CEP encontrado', 'success');
    } else {
      const cepEncontrado2 = await this.consultCepService.getCep2(this.vaga.cep);
      if (cepEncontrado2) {
        this.vaga.cidade = cepEncontrado2.cidade
        this.vaga.uf = cepEncontrado2.uf
        this.vaga.logradouro = cepEncontrado2.logradouro
        this.vaga.numero = cepEncontrado2.numero
        this.showToast('CEP encontrado', 'success');
      } else {
        this.vaga.cidade = ''
        this.vaga.uf = ''
        this.vaga.logradouro = ''
        this.vaga.numero = ''
        this.showToast('CEP não encontrado, preencha os campos manualmente', 'danger');
      }
    }
  }

  async formValido() {
    if (this.vaga.titulo_vaga == '') {
      this.showAlert('Campos Obrigatórios', 'Título da vaga não informado.')
      return false;
    } else if (this.vaga.tipo_vaga == '') {
      this.showAlert('Campos Obrigatórios', 'Tipo da vaga não informado.')
      return false;
    } else if (this.vaga.tipo_vaga == 'Emprego' && this.vaga.regime == '') {
      this.showAlert('Campos Obrigatórios', 'Regime da vaga não informado.')
      return false;
    } else if (this.vaga.modalidade == '') {
      this.showAlert('Campos Obrigatórios', 'Modalidade da vaga não informada.')
      return false;
    } else if (this.vaga.descricao == '') {
      this.showAlert('Campos Obrigatórios', 'Descrição da vaga não informado.')
      return false;
    } else if (this.vaga.idArea == 0) {
      this.showAlert('Campos Obrigatórios', 'Área de Atuação não informada.')
      return false;
    } else if (this.vaga.salario == 0) {
      this.showAlert('Campos Obrigatórios', 'Salário da vaga não informado.')
      return false;
    } else if (this.vaga.cep == '') {
      this.showAlert('Campos Obrigatórios', 'CEP da vaga não informado.')
      return false;
    } else if (this.vaga.logradouro == '') {
      this.showAlert('Campos Obrigatórios', 'Logradouro não informado.')
      return false;
    } else if (this.vaga.numero == '') {
      this.showAlert('Campos Obrigatórios', 'Número não informado.')
      return false;
    } else if (this.vaga.uf == '') {
      this.showAlert('Campos Obrigatórios', 'UF não informada.')
      return false;
    } else if (this.vaga.cnh == '') {
      this.showAlert('Campos Obrigatórios', 'Informe sobre a CNH.')
      return false;
    } else if (this.userType == 'Representante' && this.vaga.email_curriculo == null && !this.emailValido) {
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if (this.vaga.data_limite == null) {
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
      if (this.vaga.tipo_vaga !== 'Emprego' && this.vaga.regime) {
        this.vaga.regime = '';
      }
      return true;
    }
  }

  async retirarMascara() {
    const cepRegex = /[^0-9]/g;
    this.vaga.cep = this.vaga.cep.replace(cepRegex, '');
    this.vaga.cep = this.vaga.cep.replace(/[^\d]/g, '');
  }

  async cadastrarVaga() {
    if (await this.formValido()) {
      await this.retirarMascara();
      console.log(this.vaga);
      try {
        const cepContext = {
          cep: this.vaga.cep,
          cidade: this.vaga.cidade,
          uf: this.vaga.uf,
          logradouro: this.vaga.logradouro,
        }

        const formData = new FormData();
        if(this.fileImage){
          formData.append('file', this.fileImage);
          console.log('imagem adicionada');

        }


        formData.append('vaga', JSON.stringify(this.vaga));

        const response = await api.post('/create-vaga', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        await api.post('/create-cep', cepContext);

        if (response.status === 201) {
          this.showToast('Vaga cadastrada com sucesso!', 'success');
          this.navCtrl.navigateRoot('/listar-vaga');
        }

        try {
          await api.post('/create-cep', cepContext);
        } catch (cepError: any) {
          // Ignorar erros relacionados ao CEP
          if (cepError.response.status !== 400 || cepError.config.url !== '/create-cep') {
            throw cepError; // Lança o erro se não for relacionado ao CEP
          }
        }

        this.showToast('Vaga cadastrada com sucesso!', 'success');
        this.navCtrl.navigateRoot('/listar-vaga');

      } catch (error: any) {
        if (error.response.status === 400) {
          this.showToast('Esta vaga já foi publicada', 'danger');
        } else {
          console.log(error);
          this.showToast('Erro ao cadastrar a Vaga', 'danger');
        }
      }
    }
  }

  verificarEmail(): void {
    this.vaga.email_curriculo = this.vaga.email_curriculo.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValido = emailRegex.test(this.vaga.email_curriculo);
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

  cancelar() {
    this.navCtrl.pop();
  }

}