import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }

  async buscarTodasAreas() {
    const resposta = this.http.get<any[]>(this.urlBase+'/area/list')
    return resposta
  }

  async cadastrarArea(nome: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });
  
    const response = await api.post('/area/create', {
      nome : nome
    });
  
    return response;
  }
  

  async buscarAreaPorID(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/area/find/' + id)

    return response
  }

  async atualizarArea(id :string, nome : string){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.put('/area/update/'+ id,{
      nome : nome
    })

    return response
  }

  async excluir(id : string){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.delete(this.urlBase + '/area/delete/' + id)

    return response

  }

  async getAreas(){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get('/area/list')

    return response.data
}
}
