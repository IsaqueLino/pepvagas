import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoServicoService {

  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }

  // BUSCA TODOS OS TIPOS DE SERVIÇO CADASTRADOS
  async buscarTodosServicos(){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/tipo-servico/list')
    return response.data;
  }

  // BUSCA PROFISSIONAIS RELACIONADOS A UM TIPO DE SERVIÇO ESPECÍFICO
  async buscarProfissionais(id : string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/tipo-servico/profissionais/' + id)
    return response.data;
  }

  // CADASTRA UM NOVO TIPO DE SERVIÇO
  async cadastrarTipo(nome : string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post(this.urlBase + '/tipo-servico/create', {
      nome : nome
    })
    return response;
  }

  // EXCLUI UM TIPO DE SERVIÇO PELO ID
  async excluir(id : string){
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.delete(this.urlBase + '/tipo-servico/delete/' + id)
    return response
  }

  // ATUALIZA O NOME DE UM TIPO DE SERVIÇO EXISTENTE
  async atualizarTipo(id : string, nome : string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.put('/tipo-servico/update/'+ id,{
      nome : nome
    })

    return response
  }
}