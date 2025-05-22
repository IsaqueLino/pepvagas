import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly urlBase = environment.API

  
  private api = axios.create({
    baseURL: this.urlBase
  });

  constructor(private http: HttpClient, private navController: NavController) { }

  // REALIZA LOGIN DO USUÁRIO
  async login(email: string, senha: string) {

    const data: any = {}

    const response = await this.api.post('/login', {
      email: email,
      senha: senha,
      isInApp: false
    }).catch((err: AxiosError) => {
      data.status = err.response?.status
      data.response = err.response
      return data
    })

    return response
  }


  // CRIA UMA NOVA CONTA DE USUÁRIO
  async createAccount(email: string, senha: string, tipo: string) {

    const data: any = {}

    const response = await this.api.post('/conta', {
      email: email,
      senha: senha,
      tipo: tipo
    }).catch((err: AxiosError) => {
      data.status = err.response?.status
      data.response = err.response
      return data
    })

    return response
  }

  // RECUPERAÇÃO DE CONTA PELO E-MAIL
  async recovery(email: string) {

    const data: any = {}

    const response = await this.api.post('/conta/recuperacao', {
      email: email
    }).catch((err: AxiosError) => {
      data.status = err.response?.status
      data.response = err.response
      return data
    })

    return response
  }

  // SALVA DADOS DA SESSÃO NO LOCALSTORAGE
  setSession(token: string, user: string, type: string) {
    localStorage.setItem('jwt', token)
    localStorage.setItem('user', user)
    localStorage.setItem('type', type)
  }

  // SALVA DADOS DO USUÁRIO EM CRIAÇÃO
  setCreationUser(user: string) {
    localStorage.setItem('c-user', user)
  }

  // OBTÉM O TOKEN JWT DO LOCALSTORAGE
  getJwt() {
    return localStorage.getItem('jwt')
  }

  // OBTÉM O ID DO USUÁRIO DO LOCALSTORAGE
  getUser() {
    return localStorage.getItem('user')
  }

  // DEFINE O TIPO DO USUÁRIO NO LOCALSTORAGE
  setType(tipo: string) {
    localStorage.setItem('type', tipo)
  }

  // OBTÉM O TIPO DO USUÁRIO DO LOCALSTORAGE
  getType() {
    return localStorage.getItem('type')
  }

  // REALIZA LOGOUT REMOVENDO DADOS DO LOCALSTORAGE
  logout() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    localStorage.removeItem('type')
    this.navController.navigateRoot("/login")
  }

  // OBTÉM DETALHES DA CONTA DO USUÁRIO LOGADO OU DE ALGUMA OUTRA CONTA
  async getContaDetails(buscarOutraConta: boolean = false, id: number = 0) {
    let idconta: number | string | null;

    if(buscarOutraConta && id > 0)
      idconta = id;
    else
      idconta = localStorage.getItem('user'); 

    if (!idconta) {
      throw new Error('ID da conta não encontrado no localStorage');
    }
    const response = await this.api.get(this.urlBase + '/conta/' + idconta)
    return response.data
  }

  // EXCLUI UMA CONTA PELO ID
  async deleteAccount(id: string): Promise<any> {
    try {
      const response = await this.api.delete(this.urlBase + '/conta/' + id);
      return response;
    } catch (error) {
      throw new Error('Erro ao excluir conta: ' + error);
    }
  }

  // ATUALIZA A SENHA DO USUÁRIO
  async updatePassword(id: string, senhaAtual: string, novaSenha: string, confirmacaoNovaSenha: string): Promise<any> {
    try {
      const response = await this.api.put<any>(this.urlBase + '/conta/senha/' + id, {
        senhaAtual,
        novaSenha,
        confirmacaoNovaSenha
      })
      return response;
    } catch (error) {
      throw error;
    }
  }

  // LISTA TODAS AS CONTAS REGISTRADAS
  async listAcount(){
    const response = await this.api.get(this.urlBase + '/conta');
    return response;
  }

  // OBTÉM UMA CONTA PELO E-MAIL
  async getAccountByEmail(email: string){
    const response = await this.api.get(this.urlBase + '/conta/email/' + email ).catch((err) => err)
    return response
  }
}
