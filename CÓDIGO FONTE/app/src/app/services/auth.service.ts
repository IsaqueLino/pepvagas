import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios, { Axios, AxiosError } from 'axios';
import { environment } from 'src/environments/environment';
import { Network } from '@capacitor/network';


@Injectable({
  providedIn: 'root'
})

// SERVIÇO QUE FAZ A GERENCIA DE AUTORIZAÇÕES DO USUÁRIO (CANDIDATO)
export class AuthService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  });

  constructor(private http: HttpClient) { }

  // FAZ O LOGIN DO USUÁRIO COM BASE NO SEU E-MAIL E SENHA JÁ CADASTRADOS
  async login(email: string, senha: string){

      const data: any = {}
      
      const response = await this.api.post('/login',{
        email: email,
        senha: senha,
        isInApp: true
      }).catch((err)=> {
        data.status = err.response?.status
        data.response = err.response
        return data
      })

      return response
  }

  // CRIA UMA NOVA CONTA PARA O USUÁRIO (NOVO CANDIDATO)
  async createAccount(email: string | null, senha: string | null, tipo: string){

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

  // ENVIA UM EMAIL DE RECUPERAÇÃO DE CONTA PRO USUÁRIO
  async recovery(email:string){

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

  setSession(token: string, user: string, type: string){
    localStorage.setItem('jwt',token)
    localStorage.setItem('user', user)
    localStorage.setItem('type', type)
  }

  // MÉTODOS QUE ENVOLVEM A SESSÃO DO USUÁRIO:
  setCreationUser(user: string){
    localStorage.setItem('c-user', user)
  }

  getJwt(){
    return localStorage.getItem('jwt')
  }

  getUser(){
    return localStorage.getItem('user')
  }

  logout(){
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    localStorage.removeItem('type')
  }

  async getContaDetails() {
    const idconta = localStorage.getItem('user');
    if (!idconta) {
      throw new Error('ID da conta não encontrado no localStorage');
    }
    const response = await this.api.get(this.urlBase + '/conta/' + idconta)
    return response.data
  }

  // DELETA A CONTA DO USUÁRIO
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
  
}
