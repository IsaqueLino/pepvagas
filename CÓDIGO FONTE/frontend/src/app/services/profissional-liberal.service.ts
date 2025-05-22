import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProfissionalLiberalService {

  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }

  async profissionalCadastro(id: string, nome: string, nomeSocial: string, descricao: string, telefone: string, email: string) {

    const api = axios.create({
      baseURL: this.urlBase
    })

    if (telefone != null)
      telefone = telefone.replace(/[\(\)\-\s]/g, '')

    const response = await api.post('/profissional-liberal/create', {
      idconta: id,
      nome: nome,
      nomeSocial: nomeSocial,
      descricao: descricao,
      telefone: telefone,
      email: email
    })
    return response
  }

  async cadastrarTipo(id: string, tipo: string[]) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post('/profissional-liberal/tipo/'+id, {
      idconta: id,
      tipo: tipo
    })

    return response
  }

  async buscarTipoPorProfissional(id :string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    console.log("id da conta no service " + id)

    const response = await api.get(this.urlBase + '/prossional-liberal-buscar-tipo/'+ id)

    return response.data

  }

  async buscarProfissional(id : string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/profissional-liberal/findById/' + id)

    return response.data
  }

  async buscarTodos(){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/profissional-liberal/index')

    return response.data

  }

  async buscarTodosAtivos(){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/profissional-liberal/index-all')

    return response.data

  }

  async atualizarProficional(id: string, nome: string, nomeSocial: string, descricao: string, telefone: string, email: string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    if (telefone != null)
      telefone = telefone.replace(/[\(\)\-\s]/g, '')

    const resposta = await api.put('/profissional-liberal/update/'+ id, {
      nome: nome,
      nomeSocial: nomeSocial,
      descricao: descricao,
      telefone: telefone,
      email: email
    })

    return resposta
  }

  async enviarImagem(idconta: string, file: File): Promise<any>{

    const api = axios.create({
      baseURL : this.urlBase
    })

    const formData: FormData = new FormData();

    formData.append('imagem', file, file.name);

    console.log("imagem no service"+ formData)

    const response = await api.post('/profissional-liberal/sendimage/'+idconta, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response
  }

}
