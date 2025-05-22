import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  })
  

  constructor() { }

  async cadastrarEmpresa(id: string, nome: string, cnpj: string, email: string, telefone: string, site: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const formatedCnpj = cnpj.replace(/[./-]/g, '');

    if (telefone != null) {
      telefone = telefone.replace(/[\(\)\-\s]/g, '');
    }

    const response = await api.post('empresa', {
      idconta: id,
      nomeEmpresa: nome,
      cnpj: formatedCnpj,
      site: site,
      telefone: telefone,
      email: email,
    })

    return response
  }

  async alterarEmpresa(id: string, nome: string, cnpj: string, email: string, telefone: string, site: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const formatedCnpj = cnpj.replace(/[./-]/g, '');

    if (telefone != null) {
      telefone = telefone.replace(/[\(\)\-\s]/g, '');
    }

    const response = await api.put('empresa/' + id, {
      nomeEmpresa: nome,
      cnpj: formatedCnpj,
      site: site,
      telefone: telefone,
      email: email,
    })

    return response
  }

  async getEmpresa(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/empresa/' + id)

    return response.data
  }

  async getEmpresas() {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/empresa/')

    return response.data
  }

  async getRepresentantesEmpresaId(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/empresa/representantes/' + id)

    return response.data
  }
}
