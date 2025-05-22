import { Component, OnInit } from '@angular/core';
import { CandidatoService } from '../services/candidato.service';
import { AuthService } from '../services/auth.service';
import { VagaService } from '../services/vaga.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-vagas-candidatas',
  templateUrl: 'vagas-candidatas.page.html',
  styleUrls: ['vagas-candidatas.page.scss'],
})
export class VagasCandidatasPage implements OnInit {

  private vagas: any[] = [];  // Sem interface, utilizando 'any'
  public listaVagas: any = [...this.vagas];  // 'any' aqui também
  public isDarkTheme: boolean = false;
  public user: any = {};
  public isLogged: boolean = false;
  public userType: string = '';  // Declarar userType

  public searchValue: string = "";

  public isToastOpen = false;

  public toastButtons = [
    {
      text: 'Perfil',
      role: 'info',
      handler: () => {
        this.navController.navigateRoot('candidato-perfil');
      },
    },
    {
      text: 'X',
      role: 'cancel',
    },
  ];

  constructor(
    private candidatoService: CandidatoService,
    private authService: AuthService,
    private vagaService: VagaService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getCandidaturas();  // Carregar somente as candidaturas
    this.checkTheme();
    this.getUser();

    if (this.authService.getJwt()) {
      this.isLogged = true;
    }

    sessionStorage.clear();
  }

  async ionViewWillEnter() {
    this.ngOnInit();
  }

  async getCandidaturas() {
    const userId = this.authService.getUser();
    if (userId) {
      try {
        const response = await this.candidatoService.getCandidaturas(userId);
  
        if (response && response.length > 0) {
          // Primeiro atualiza o array principal 'vagas'
          this.vagas = response.map((vaga: any) => {
            if (!vaga.idEmpresa) {
              console.warn(`Vaga ${vaga.idVaga} não tem empresa associada!`);
            }
            return vaga;
          });
          
          // Depois cria uma cópia para 'listaVagas'
          this.listaVagas = [...this.vagas];
        } else {
          // Garante que ambos arrays estão vazios quando não há resultados
          this.vagas = [];
          this.listaVagas = [];
        }
      } catch (error) {
        console.error('Erro ao buscar candidaturas:', error);
        // Limpa os arrays em caso de erro
        this.vagas = [];
        this.listaVagas = [];
      }
    } else {
      // Limpa os arrays se não houver usuário
      this.vagas = [];
      this.listaVagas = [];
    }
  }

  // Método para carregar o usuário
  async getUser() {
    const userId = this.authService.getUser();
    const userType = this.authService.getType();
    if (userId == null) {
      this.isLogged = false;
    } else {
      this.userType = userType ?? '';  // Agora 'userType' está declarada corretamente
      switch (userType) {
        case "C":
          this.user = await this.candidatoService.getCandidato(userId);
          break;
      }

      this.isLogged = true;
    }
  }

  // Método de busca
  search() {
    const query = this.searchValue.toLowerCase();
    
    this.listaVagas = this.vagas.filter(vaga => 
      vaga.titulo.toLowerCase().includes(query)
    );
  }
  
  // Toggle de tema
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.handleTheme();
  }

  // Checa o tema atual
  private checkTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.setAttribute('color-scheme', 'dark');
      this.isDarkTheme = true;
    } else {
      document.body.setAttribute('color-scheme', 'light');
      this.isDarkTheme = false;
    }
  }

  // Altera o tema
  private handleTheme() {
    if (this.isDarkTheme) {
      document.body.setAttribute('color-scheme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('color-scheme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  // Logout
  logout() {
    this.authService.logout();
    this.navController.navigateRoot('login');
  }

  verVagaDetalhes(idVaga: string) {
    localStorage.setItem('idVaga', idVaga);
    this.navController.navigateForward(['/vaga-detalhes'], {
      queryParams: { fromCandidaturas: true }, 
    });
  }
}
