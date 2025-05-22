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

    console.log(response)

    return response
  }

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

  setSession(token: string, user: string, type: string) {
    localStorage.setItem('jwt', token)
    localStorage.setItem('user', user)
    localStorage.setItem('type', type)
  }

  setCreationUser(user: string) {
    localStorage.setItem('c-user', user)
  }

  getJwt() {
    return localStorage.getItem('jwt')
  }

  getUser() {
    return localStorage.getItem('user')
  }

  setType(tipo: string) {
    localStorage.setItem('type', tipo)
  }

  getType() {
    return localStorage.getItem('type')
  }

  logout() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    localStorage.removeItem('type')
    this.navController.navigateRoot("/login")
  }

  async getContaDetails() {
    const idconta = localStorage.getItem('user');
    console.log("conta encontrada", idconta)
    if (!idconta) {
      throw new Error('ID da conta não encontrado no localStorage');
    }
    const response = await this.api.get(this.urlBase + '/conta/' + idconta)
    return response.data
  }

  async deleteAccount(id: string): Promise<any> {
    try {
      const response = await this.api.delete(this.urlBase + '/conta/' + id);
      return response;
    } catch (error) {
      throw new Error('Erro ao excluir conta: ' + error);
    }
  }

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

  async listAcount(){
    const response = await this.api.get(this.urlBase + '/conta');
    return response;
  }

  async getAccountByEmail(email: string){
    const response = await this.api.get(this.urlBase + '/conta/email/' + email ).catch((err) => err)
    return response
  }
}
