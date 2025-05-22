import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  })

  constructor(private authService: AuthService) { }

  // CADASTRA UM NOVO REPRESENTANTE COM NOME, ID DA CONTA E ID DA EMPRESA
  async cadastrarRepresentante(id: string, nome: string, idEmpresa: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post('representante', {
      nome: nome,
      idconta: id,
      idEmpresa: idEmpresa
    })

    return response
  }

  // BUSCA UM REPRESENTANTE PELO ID (COM VALIDAÇÃO DE TOKEN JWT)
  async getRepresentante(id: string) {
    const jwt = this.authService.getJwt();

    try {
      const response = await this.api.get(`${this.urlBase}/representante/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      return response.data; // <- já devolve só os dados
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status == 401) {
        this.authService.logout();
      }
      return null;
    }
  }
  // ATUALIZA OS DADOS DE UM REPRESENTANTE EXISTENTE
  async alterarRepresentante(id: string, nome: string, empresa: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.put('representante/' + id, {
      idconta: id,
      nome: nome,
      idEmpresa: empresa
    })

    return response
  }

  async getEmpresaDoRepresentante(idRepresentante: string): Promise<number | null> {
    const jwt = this.authService.getJwt();

    try {
      const response = await this.api.get(`${this.urlBase}/representante/${idRepresentante}/empresa`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      if (!response.data?.idEmpresa) {
        console.error("Erro: ID da empresa não retornado corretamente.");
        return null;
      }

      return Number(response.data.idEmpresa); // Garante que é um número
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        this.authService.logout();
      }
      console.error("Erro ao buscar empresa do representante:", error);
      return null;
    }
  }

  async desativarRepresentante(id: string) {
    try {
      const jwt = this.authService.getJwt();

      const response = await this.api.delete(`/representante/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao desativar representante:', error);

      if (error.response) {
        return error.response.data;
      }

      return { data: { message: "Erro ao desativar o representante. Tente novamente mais tarde." } };
    }
  }


}