import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// SERVIÇO QUE FAZ A GERENCIA DE ÁREAS DO CANDIDADO
export class AreaService {

  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }

  // BUSCA TODAS AS ÁREAS DISPONÍVEIS PRO CANDIDATO
  async buscarTodasAreas(){
    const resposta = this.http.get<any[]>(this.urlBase + '/area/list')
    return resposta
  }

  async buscarAreaPorID(id: string){
    const api = axios.create({
      baseURL : this.urlBase
    })

    const response = await api.get(this.urlBase + '/area/find/' + id)

    return response
  }

  // BUSCA TODAS AS ÁREAS
  async getAreas(){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get('/area/list')

    return response.data
  }

  // CADASTRA UMA NOVA ÁREA SE NECESSÁRIO
  async cadastrarArea(nome: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });
  
    const response = await api.post('/area/create', {
      nome : nome
    });
  
    return response;
  }

}
