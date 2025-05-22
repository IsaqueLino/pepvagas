import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// SERVIÇO QUE FAZ A GERENCIA DE VAGAS
export class VagaService {
  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }

  // BUSCA TODAS AS VAGAS
  async getVagas(){
      const api = axios.create({
        baseURL: this.urlBase
      });

      const response = await api.get('/vaga')

      return response
  }

  // BUSCA UMA VAGA PELO ID
  async getVaga(id: string){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get(this.urlBase + '/vaga/' + id)
    return response
  }

  async candidatar(idconta: string, idVaga: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });

    try {

      const response = await api.post(`/candidatar/${idconta}/${idVaga}`);

      return response;
    } catch (error) {
      console.error('Erro na requisição de candidatura:', error);
      throw error;
    }
  }


}
