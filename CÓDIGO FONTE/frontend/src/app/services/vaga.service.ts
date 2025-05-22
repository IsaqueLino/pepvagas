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

  // BUSCA TODAS AS VAGAS CADASTRADAS
  async getVagas() {
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get('/vaga')

    return response
  }

  // BUSCA UMA VAGA ESPECÍFICA PELO ID
  async getVaga(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get(this.urlBase + '/vaga/ ' + id)

    return response
  }

  // BUSCA VAGAS RELACIONADAS A UMA CONTA ESPECÍFICA
  async getVagasPorConta(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });

    const response = await api.get('/vaga/conta/' + id)

    return response
  }

  async getVagasDoRepresentante(idRepresentante: number | string) {
    const api = axios.create({
      baseURL: this.urlBase
    });
  
    const response = await api.get(`/vaga/representante/${idRepresentante}`);
    return response;
  }  

  // REALIZA A CANDIDATURA DE UM USUÁRIO A UMA VAGA
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

  // CRIA UMA NOVA VAGA COM OS DADOS FORNECIDOS
  async create(vaga: any) {
    const api = axios.create({
        baseURL: this.urlBase
    });

    if (!vaga.idEmpresa) {
        throw new Error("ID da empresa inválido ao criar vaga.");
    }

    return await api.post(this.urlBase + '/vaga/', {
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
        "site": vaga.site ?? null,
        "idArea": vaga.idArea,
        "emailCurriculo": vaga.emailCurriculo,
        "idEmpresa": vaga.idEmpresa, 
        "ocultarNome": vaga.ocultarNome ? 'S' : 'N'
    });
}

  // ATUALIZA OS DADOS DE UMA VAGA EXISTENTE
  async update(vaga: any, idVaga: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });


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
      "idEmpresa": vaga.idEmpresa,
      "ocultarNome": vaga.ocultarNome
    })

    return response
  }

  // ENVIA ARQUIVOS DE LOGO E BANNER PARA UMA VAGA
  async sendLogoAndBanner(id: string, logo: File, banner: File) {
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

  // REMOVE UMA VAGA DO SISTEMA
  async delete(id: string, jwt: string) {
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