import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VagaService {
  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }

  async getVagas(){
      const api = axios.create({
        baseURL: this.urlBase
      });

      const response = await api.get('/vaga')

      return response
  }

  async getVaga(id: string){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get(this.urlBase + '/vaga/ ' + id)
    return response
  }

}
