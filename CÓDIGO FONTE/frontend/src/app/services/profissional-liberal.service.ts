import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import axios, { AxiosError } from 'axios';


@Injectable({
  providedIn: 'root'
})
export class ProfissionalLiberalService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  })

  constructor(private http: HttpClient, private authService: AuthService) { }

  // CADASTRA UM NOVO PROFISSIONAL LIBERAL COM DADOS PESSOAIS E DE CONTATO
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

  // ASSOCIA TIPOS DE SERVIÇO A UM PROFISSIONAL LIBERAL
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

  // BUSCA OS TIPOS DE SERVIÇO ASSOCIADOS A UM PROFISSIONAL
  async buscarTipoPorProfissional(id :string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await this.api.get('/profissional-liberal-buscar-tipo/' + id)
    return response.data
  }

  // BUSCA UM PROFISSIONAL LIBERAL PELO ID
  async buscarProfissional(id : string){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/profissional-liberal/findById/' + id)

    return response.data
  }

  // LISTA TODOS OS PROFISSIONAIS LIBERAIS CADASTRADOS
  async buscarTodos(){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/profissional-liberal/index')

    return response.data
  }

  // LISTA TODOS OS PROFISSIONAIS LIBERAIS ATIVOS
  async buscarTodosAtivos(){
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/profissional-liberal/index')

    return response.data
  }

  // ATUALIZA OS DADOS DE UM PROFISSIONAL LIBERAL EXISTENTE
  async atualizarProficional(id: string, nome: string, nomeSocial: string, descricao: string, telefone: string, email: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });
  
    if (telefone != null)
      telefone = telefone.replace(/[\(\)\-\s]/g, '');
  
    const response = await api.put('/profissional-liberal/update/' + id, {
      nome: nome,
      nomeSocial: nomeSocial,
      descricao: descricao,
      telefone: telefone,
      email: email
    });
  
    return response;
  }
  
  async desativarProfissional(id: string) {
    try {
      const jwt = this.authService.getJwt();

      const response = await this.api.delete(`/profissional-liberal/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao desativar:', error);

      if (error.response) {
        return error.response.data;
      }

      return { data: { message: "Erro ao desativar. Tente novamente mais tarde." } };
    }
  }

  // BUSCA UM PROFISSIONAL LIBERAL PELO ID COM AUTENTICAÇÃO JWT
async getProfissionalLiberal(id: string) {
  const jwt = this.authService.getJwt();

  try {
    const response = await this.api.get(`/profissional-liberal/findById/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response?.status === 401) {
      this.authService.logout();
    }

    console.error("Erro ao buscar profissional liberal:", error);
    return null;
  }
}


  // ENVIA UMA IMAGEM (FOTO/LOGO) PARA O PERFIL DO PROFISSIONAL
  async enviarImagem(idconta: string, file: File): Promise<any>{
    const api = axios.create({
      baseURL : this.urlBase
    })

    const formData: FormData = new FormData();
    formData.append('imagem', file, file.name);


    const response = await api.post('/profissional-liberal/sendimage/'+idconta, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response
  }
}