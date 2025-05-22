import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VagaService {

  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }

  async getVagas() {
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get('/vaga')

    return response
  }

  async getVaga(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });
    
    const response = await api.get(this.urlBase + '/vaga/ ' + id)
    
    console.log(response)
    return response
  }

  async getVagasPorConta(id: string){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get('/vaga/conta/' + id)

    return response
  }

  async create(vaga: any){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.post(this.urlBase + '/vaga/', {
      "idConta": vaga.idConta,
      "titulo": vaga.titulo,
      "modalidade": vaga.modalidade,
      "tipo": vaga.tipo,
      "regime": vaga.regime,
      "descricao": vaga.descricao,
      "salario": vaga.salario,
      "pcd": vaga.pcd,
      "dataLimite": vaga.dataLimite,
      "cidade": vaga.cidade,
      "nivelInstrucao": vaga.nivelInstrucao,
      "site": vaga.site,
      "idArea": vaga.idArea,
      "emailCurriculo": vaga.emailCurriculo,
      "idEmpresa": vaga.idEmpresa
    })

    return response
  }

  async update(vaga: any, idVaga: string){
    const api = axios.create({
      baseURL: this.urlBase
    });

    console.log(vaga)

    const response = await api.put(this.urlBase + '/vaga/' + vaga.idVaga, {
      "titulo": vaga.titulo,
      "modalidade": vaga.modalidade,
      "tipo": vaga.tipo,
      "regime": vaga.regime,
      "descricao": vaga.descricao,
      "salario": +vaga.salario,
      "pcd": vaga.pcd,
      "dataLimite": vaga.dataLimite,
      "cidade": vaga.cidade,
      "nivelInstrucao": vaga.nivelInstrucao,
      "site": vaga.site,
      "idArea": vaga.idArea,
      "emailCurriculo": vaga.emailCurriculo,
      "idEmpresa": vaga.idEmpresa
    })

    return response
  }

  async sendLogoAndBanner(id: string,logo: File, banner: File){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const formData: FormData = new FormData();

    formData.append('logo', logo, logo.name); 
    formData.append('banner', banner, banner.name);

    const response = await api.post('/vaga/sendLogoAndBanner/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });

    return response;
  }

  async delete(id: string, jwt: string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.delete('/vaga/' + id, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return response
  }
}

