import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembroService {

  private readonly urlBase = environment.API

  constructor() { }

  async cadastrarMembroEquipe(id: string, nome: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post('equipe', {
      nome: nome,
      idconta: id
    })

    return response
  }

  async getMembroEquipe(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/equipe/' + id)

    return response.data
  }

  async alterarMembroEquipe(id: string, nome: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.put('equipe/' + id, {
      nome: nome,
    })

    return response
  }

}
