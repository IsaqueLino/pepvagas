import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AxiosError } from 'axios';
import { api } from 'src/app/services/axios';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.page.html',
  styleUrls: ['./alterar.page.scss'],
})
export class AlterarPage implements OnInit {

  idRepresentante: number = 0;
  representante: any = {};

  nomeNovo: string = "";
  emailNovo: string = "";
  senhaNova: string = "";

  public type = 'password';
  public showPass = false;
  public emailValido = true;
  public nomeValido = true;
  public checkSenha: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idRepresentante = params['idRepresentante'];
      // Se quem estiver autenticado for um representante e o id passado for diferente do id dela, redireciona ela para a página dela
      if (localStorage.getItem('userType') == 'Representante' && localStorage.getItem('userId') != this.idRepresentante.toString()) {
        this.navCtrl.navigateForward(['/alterar-representante'], {
          queryParams: {
            idRepresentante: localStorage.getItem('userId')
          }
        });
      } else if (
        //Caso o representante esteja vendo a página dele ou seja uma empresa vendo qualquer representante.
        (localStorage.getItem('userType') == 'Representante' && localStorage.getItem('userId') == this.idRepresentante.toString())
        || localStorage.getItem('userType') == 'Empresa') {
        this.carregarRepresentantePorId(this.idRepresentante);
      }
    });
  }

  async carregarRepresentantePorId(idRepresentante: number) {
    try {
      const response = await api.get(`/find-representante/${idRepresentante}`);
      if (response.status === 200) {
        this.representante = response.data;
        this.nomeNovo = this.representante.nome;
        this.emailNovo = this.representante.email;
      }
    } catch (error) {
      console.error('Erro ao carregar o representante:', error);
      this.showToast('Erro ao carregar o representante', 'danger');
    }
  }

  async formValido() {
    if(this.nomeNovo == ''){
      this.showAlert('Campos Obrigatórios', 'Nome do Representante não informado.')
      return false;
    } else if(!this.nomeValido){
      this.showAlert('Campos Obrigatórios', 'Nome inválido.')
      return false;
    } else if(this.senhaNova == ''){
      this.showAlert('Campos Obrigatórios', 'Senha não informada.')
      return false;
    } else if(this.emailNovo == ''){
      this.showAlert('Campos Obrigatórios', 'Email não informado.')
      return false;
    } else if(!this.emailValido){
      this.showAlert('Campos Obrigatórios', 'Email inválido.')
      return false;
    } else if ((this.senhaNova!='' && this.checkSenha!='') && !(this.senhaNova === this.checkSenha && this.senhaRequisitos.lengthCheck && this.senhaRequisitos.upperLowerCheck && this.senhaRequisitos.numberCheck && this.senhaRequisitos.specialCharCheck)) {
      this.showAlert('Campos Obrigatórios', 'Senha inválida.')
      return false;
    } else{
      console.log(this.nomeNovo);
      return true;
    }
  }

  async alterarRepresentante() {
    if (await this.formValido()) {
      
      try {
        const dadosDeAlteracao = {
          nome: this.nomeNovo,
          email: this.emailNovo,
          senha: this.senhaNova
        }
        const response = await api.put(`/update-representante/${this.idRepresentante}`, dadosDeAlteracao);
        
        if(response.status === 200){
          this.showToast('Dados alterados com sucesso', 'success');
          if(localStorage.getItem('userType') == 'Representante'){
            this.navCtrl.navigateForward('/perfil-representante')
          }else{
            this.navCtrl.navigateForward('/listar-representantes');
          }
        }
      } catch (error:any) {
        if(error.response.status === 409){
          this.showToast('Já existe um representante com o mesmo e-mail cadastrada', 'danger');
        }else{
          console.error('Erro ao alterar o representante:', error);
          this.showToast('Erro ao alterar o representante', 'danger');
        }
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

    this.emailNovo = this.emailNovo.toLowerCase();
    this.emailNovo = this.emailNovo.trim();

    if (this.emailNovo.includes('@') && this.emailNovo.includes('.')) {
      this.emailValido = true;
    } else {
      this.emailValido = false;
    }

  }

  bloquearNumeros(event: any): boolean {
    const input = event.target.value;
    const regex = /[0-9]/g; // Expressão regular para verificar números

    if (regex.test(input)) {
      return this.nomeValido = false;
    }
    return this.nomeValido = true;
  }

  cancelar(){
    this.navCtrl.pop();
  }
}
