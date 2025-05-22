import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  })
  

  constructor() { }

  async cadastrarRepresentante(id: string, nome: string, idEmpresa: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post('representante', {
      nome: nome,
      idconta: id,
      idEmpresa: idEmpresa
    })

    return response
  }

  async getRepresentante(id: string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get('representante/' + id)

    return response.data
  }

  async alterarRepresentante(id: string, nome: string, empresa: string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.put('representante/' + id, {
      idconta: id,
      nome: nome,
      idEmpresa: empresa
    })

    return response
  }
}
