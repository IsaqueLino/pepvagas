import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MembroService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  })

  constructor(private authService: AuthService) { }

  // CADASTRA UM NOVO MEMBRO NA EQUIPE COM ID E NOME
  async cadastrarMembroEquipe(id: string, nome: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post('equipe', {
      nome: nome,
      idconta: id
    })

    return response
  }

  async desativarMembro(id: string) {
    try {
      const jwt = this.authService.getJwt();

      const response = await this.api.delete(`/equipe/${id}`, {
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

      return { data: { message: "Erro ao desativar . Tente novamente mais tarde." } };
    }
  }
  // BUSCA UM MEMBRO DA EQUIPE PELO ID COM AUTENTICAÇÃO JWT
async getMembroEquipe(id: string) {
  const jwt = this.authService.getJwt();

  try {
    const response = await this.api.get(`${this.urlBase}/equipe/${id}`, {
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
    return null; // ou pode lançar o erro se preferir
  }
}

  // ATUALIZA O NOME DE UM MEMBRO DA EQUIPE
  async alterarMembroEquipe(id: string, nome: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.put('equipe/' + id, {
      nome: nome,
    })

    return response
  }
}