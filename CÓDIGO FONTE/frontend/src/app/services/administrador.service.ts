import { Injectable } from '@angular/core';
import axios, { Axios, AxiosError } from 'axios';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdministradorService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  })


  constructor(
    private authService: AuthService
  ) { }

  async getAdministrador(id: string) {
    const jwt = this.authService.getJwt();
  
    try {
      const response = await this.api.get(`/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
  
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        this.authService.logout();
      }
      console.error("Erro ao buscar administrador:", err);
      return null;
    }
  }
  
  // LISTA TODOS OS ADMINISTRADORES
  async getAdministradores() {

    const jwt = this.authService.getJwt()

    const response = await this.api.get(this.urlBase + "/admin", {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return response.data ?? null
  }
  
  // LISTA TODOS OS ADMINISTRADORES
  async criar(id: string, nome: string) {

    const jwt = this.authService.getJwt()

    const response = await this.api.post(this.urlBase + "/admin", {
      idconta: id, nome: nome
    })

    return response.data ?? null
  }

  // ATUALIZA O NOME DE UM ADMINISTRADOR EXISTENTE
  async alterar(id: string, nome: string) {

    const response = await this.api.put(this.urlBase + "/admin/" + id, {
      nome: nome
    })

    return response ?? null
  }

  // REMOVE UM ADMINISTRADOR PELO ID
  async excluir(id: string) {

    const jwt = this.authService.getJwt()

    const response = await this.api.delete(this.urlBase + "/admin/" + id, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return response.data ?? null
  }
}
