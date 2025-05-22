import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, IonModal, NavController, ToastController } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TipoServicoService } from '../services/tipo-servico.service';
import { ProfissionalLiberalService } from '../services/profissional-liberal.service';
import { OverlayEventDetail } from '@ionic/core/components';


@Component({
  selector: 'app-perfil-profissional-liberal',
  templateUrl: './perfil-profissional-liberal.page.html',
  styleUrls: ['./perfil-profissional-liberal.page.scss'],
})
export class PerfilProfissionalLiberalPage implements OnInit {

  public isDarkTheme: boolean = false
  public isLogged: boolean = false
  public selectedFile: File | null = null;
  public obrigatorio: FormGroup;
  public senha: FormGroup;
  public opcoes : any = []

  public tipoDeServico : any = {}
  public conta: any = {}
  public profissional: any = {}
  public proficionalAlterado: any = {}

  constructor(private formBuilder: FormBuilder, private alertController: AlertController ,private toastController: ToastController, private authService: AuthService, private navController : NavController, private tipoService : TipoServicoService, private profissionalService : ProfissionalLiberalService) {
    if(this.authService.getJwt() == null)
      this.navController.navigateRoot('login')


    this.obrigatorio = this.formBuilder.group({
      nome: [null],
      nomeSocial:[null],
      descricao: [null],
      telefone : [null],
      email : [null],
      tipo:[null],
      imagem: [null]
    });

    this.senha = this.formBuilder.group({
      senhaAtaul : [null],
      senhaNova: [null],
      senhaConfirmada: [null]
    })

   }

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/,  '-', /\d/, /\d/, /\d/, /\d/],
  };

  async ngOnInit() {
    this.obterOpcoes()
    this.checkTheme()

    const mostrarToast = localStorage.getItem('mostrarToastAtualizacao');
    if (mostrarToast === 'true') {
      localStorage.removeItem('mostrarToastAtualizacao');
      this.presentToast("Profissional Liberal atualizado com sucess!o");
    }

    if (this.authService.getJwt()){
      this.isLogged = true
    }

    try {
      this.conta = await this.authService.getContaDetails()

    } catch (error) {
      console.error('Erro ao obter detalhes da conta:', error)
    }

    

    try{
      this.profissional =  await this.profissionalService.buscarProfissional(this.conta.idConta)
    }catch{
      console.log("não foi obtido")
    }

    this.conta.nome = this.profissional.nome
    this.conta.nomeSocial = this.profissional.nomeSocial
    this.conta.descricao = this.profissional.descricao
    this.conta.telefone = this.formatTelefone(this.profissional.telefone)
    this.conta.email = this.profissional.email
    this.tipoDeServico = await this.profissionalService.buscarTipoPorProfissional(this.conta.idConta)

  }

  @ViewChild('modal1', { static: true }) modal!: IonModal;
  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.'


  formatTipoProfissional(tipo: any[]): string {
    if (!Array.isArray(tipo) || tipo.length === 0) {
        return "Tipos de Serviços não informados";
    } else {
        const nomesAreas = tipo.map(tipoServico => tipoServico.nome);
        return nomesAreas.join(", ");
    }
  }

  openEditModal() {
    // Define os valores atuais da conta nos campos do formulário
    this.obrigatorio.setValue({
      nome: this.conta.nome || null,
      nomeSocial: this.conta.nomeSocial || null,
      descricao: this.conta.descricao || null,
      telefone: this.conta.telefone || null,
      email: this.conta.email || null,
      tipo: this.tipoDeServico.map((tipo: { id: any; }) => tipo.id) || null,
      imagem: null  // Inicialmente, o campo de imagem é nulo
    });
  
    // Abre o modal
    this.modal.present();
  }


  formatTelefone(telefone: string): string {
    if (telefone && telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }  else {
      return telefone;
    }
  }

  onFileSelected(event: any) {
    const size = 8 * 1024 * 1024

    const selectedFile = event.target.files[0];

    if(event.target.files[0] != null){

      if(selectedFile != null && selectedFile.size > size){
        this.presentToast("O tamanho do banner deve ter no maximo 8 MB ")
      }else{
        this.selectedFile = selectedFile
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async obterOpcoes(){
    try {
      this.opcoes = await this.tipoService.buscarTodosServicos();
      this.opcoes.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar as opções:', error);
      this.presentToast('Erro ao carregar as opções de serviços.');
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  onWillDismissPassword(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  confirmPassword(){
    this.updatePassword()
    // this.modal2.dismiss(this.candidato.nome, 'confirm')
  }

  cancelPassword() {
    this.modal2.dismiss(null, 'cancel');
  }

  async updatePassword() {
    try {
      if (this.senha.value["senhaNova"].length < 4) {
        this.exibirMensagem("Nova senha deve ter no mínimo 4 caracteres.")
      }
      else if(this.senha.value["senhaNova"] != this.senha.value["senhaConfirmada"]){
        this.exibirMensagem("A nova senha e sua confirmação não coincidem.")
      }
      else{
        const response = await this.authService.updatePassword(this.conta.idConta, this.senha.value["senhaAtaul"], this.senha.value["senhaNova"], this.senha.value["senhaConfirmada"]);
        if (response.status === 200) {
          this.exibirMensagem("Senha atualizada com sucesso!");
          this.modal2.dismiss(null, 'confirm');
          this.senha.value["senhaAtaul"] = ''
          this.senha.value["senhaNova"] = ''
          this.senha.value["senhaConfirmada"] = ''
        } else {
          this.exibirMensagem("Senha Atual incorreta");
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      this.exibirMensagem('Senha Atual incorreta');
    }
  }

  toggleTheme() {
    if (this.isDarkTheme)
      this.isDarkTheme = false
    else
      this.isDarkTheme = true

    this.handleTheme()
  }

  private checkTheme() {
    const theme = localStorage.getItem('theme')
    if (theme == 'dark') {
      document.body.setAttribute('color-scheme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
    }
  }

  logout() {
    this.authService.logout()
    this.navController.navigateForward('/login')
  }

  private handleTheme() {
    if (this.isDarkTheme) {
      document.body.setAttribute('color-scheme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.setAttribute('color-scheme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  async deactivateAccount(id: string): Promise<void> {
    try {

        const response = await this.profissionalService.desativarProfissional(id);

        const mensagem = response?.message || response?.data?.message;

        if (mensagem) {
            if (mensagem === "Profissional desativado com sucesso!") {
                const responseConta = await this.authService.deleteAccount(id);

                if (responseConta?.data?.message) {
                    await this.exibirMensagem("Conta desativada com sucesso!");
                    this.logout();
                } else {
                    console.error('Erro ao desativar a conta. Resposta da API de conta:', responseConta);
                    this.exibirMensagem(responseConta?.data?.message || 'Erro ao desativar a conta. Tente novamente mais tarde.');
                }
            } else {
                console.error('Erro ao desativar :', mensagem);
                this.exibirMensagem(mensagem);
            }
        } else {
            console.error('Resposta inválida ou sem mensagem da API de representante.');
            this.exibirMensagem('Erro ao desativar . Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro ao desativar :', error);
        this.exibirMensagem('Ocorreu um erro ao tentar desativar . Tente novamente.');
    }
}

  public actionSheetButtons = [
    {
      text: 'Prosseguir',
      role: 'destructive',
      handler: () => {
        this.deactivateAccount(this.conta.idConta);
      }
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  async fechar(){
    this.modal.dismiss(null, 'cancel');
  }

  async onTipoChange(event: any) {
    const selectedValues = event.detail.value;
    if (selectedValues.includes('outro')) {
      const alert = await this.alertController.create({
        header: 'Outro Tipo de Serviço',
        inputs: [
          {
            name: 'outroTipo',
            type: 'text',
            placeholder: 'Informe o outro tipo de serviço',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              // Remover a seleção de "Outro"
              this.obrigatorio.patchValue({
                tipo: selectedValues.filter((value: string) => value !== 'outro')
              });
            },
          },
          {
            text: 'OK',
            handler: (data) => {
              if (data.outroTipo) {
                this.tipoService.cadastrarTipo(data.outroTipo)
                const newOption = { id: data.outroTipo, nome: data.outroTipo };
                this.opcoes.push(newOption);
                this.obrigatorio.patchValue({
                  tipo: [...selectedValues.filter((value: string) => value !== 'outro'), data.outroTipo]
                });
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  public async onSubmit() {
    try {
      // 1. Preparar os dados
      const dados = {
        nome: this.obrigatorio.value["nome"] || this.profissional.nome,
        nomeSocial: this.obrigatorio.value["nomeSocial"] || this.profissional.nomeSocial,
        descricao: this.obrigatorio.value["descricao"] || this.profissional.descricao,
        telefone: this.obrigatorio.value["telefone"] ? 
                 this.obrigatorio.value["telefone"].replace(/[^\d]/g, '') : 
                 this.profissional.telefone,
        email: this.obrigatorio.value["email"] || this.profissional.email,
        tipo: this.obrigatorio.value["tipo"] || this.tipoDeServico.map((t: any) => t.id)
      };
  
      // 2. Enviar atualizações básicas
      const respostaBasica = await this.profissionalService.atualizarProficional(
        this.conta.idConta,
        dados.nome,
        dados.nomeSocial,
        dados.descricao,
        dados.telefone,
        dados.email
      );
  
  
      // 3. Atualizar tipos de serviço
      const respostaTipos = await this.profissionalService.cadastrarTipo(
        this.conta.idConta,
        dados.tipo
      );
  
      // 4. Atualizar imagem se fornecida
      if (this.selectedFile) {
        const respostaImagem = await this.profissionalService.enviarImagem(
          this.conta.idConta,
          this.selectedFile
        );
      }
  
      // 5. Atualizar dados locais
      await this.carregarDadosAtualizados();
      
      this.presentToast("Dados atualizados com sucesso!");
      this.modal.dismiss(null, 'confirm');
  
    } catch (error) {
      console.error('Erro detalhado:', error);
      localStorage.setItem('mostrarToastAtualizacao', 'true');
      window.location.reload();
    }
  }
  
  private async carregarDadosAtualizados() {
    this.profissional = await this.profissionalService.buscarProfissional(this.conta.idConta);
    this.tipoDeServico = await this.profissionalService.buscarTipoPorProfissional(this.conta.idConta);
    
    this.conta.nome = this.profissional.nome;
    this.conta.nomeSocial = this.profissional.nomeSocial;
    this.conta.descricao = this.profissional.descricao;
    this.conta.telefone = this.formatTelefone(this.profissional.telefone);
    this.conta.email = this.profissional.email;
  }

}
