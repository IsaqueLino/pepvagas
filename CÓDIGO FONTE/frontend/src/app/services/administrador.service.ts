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

    const jwt = this.authService.getJwt()

    const response = await this.api.get(this.urlBase + "/admin/" + id, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).catch((err: AxiosError)=> {
      if(err.response?.status == 401){
        this.authService.logout()
      }

      return err
    })


    return response
  }

  async getAdministradores() {

    const jwt = this.authService.getJwt()

    const response = await this.api.get(this.urlBase + "/admin", {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return response.data ?? null
  }
  async criar(id: string, nome: string) {

    const jwt = this.authService.getJwt()

    const response = await this.api.post(this.urlBase + "/admin", {
      idconta: id, nome: nome
    })

    return response.data ?? null
  }
  async alterar(id: string, nome: string) {

    const response = await this.api.put(this.urlBase + "/admin/" + id, {
      nome: nome
    })

    return response ?? null
  }
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
