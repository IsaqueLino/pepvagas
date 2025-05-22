import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly urlBase = environment.API

  private api = axios.create({
    baseURL: this.urlBase
  })

  constructor(private authService: AuthService) { }

  //VERIFICA A EXISTÊNCIA DE UM CNPJ JÁ CADASTRADO NO BANCO
  async verificarCNPJRepetido(cnpj: string) {

    const api = axios.create({
      baseURL: this.urlBase
    });

    cnpj = cnpj.replace(/\D/g, '');
  
    try {
      const response = await api.get(`/empresa/cnpj/${cnpj}`);
      return {
        encontrado: true,
        mensagem: response.data.message
      };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return {
          encontrado: false,
          mensagem: error.response.data.message
        };
      } else {
        console.error("Erro ao verificar CNPJ:", error);
        throw new Error("Erro ao verificar CNPJ no servidor");
      }
    }
  }

  // CADASTRA UMA NOVA EMPRESA COM DADOS BÁSICOS E FORMATA CNPJ/TELEFONE
  async cadastrarEmpresa(id: string, nome: string, cnpj: string, email: string, telefone: string, site: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const formatedCnpj = cnpj.replace(/[./-]/g, '');

    if (telefone != null) {
      telefone = telefone.replace(/[\(\)\-\s]/g, '');
    }

    const response = await api.post('empresa', {
      idconta: id,
      nomeEmpresa: nome,
      cnpj: formatedCnpj,
      site: site,
      telefone: telefone,
      email: email,
    })

    return response
  }

  // ATUALIZA OS DADOS DE UMA EMPRESA EXISTENTE
  async alterarEmpresa(id: string, nome: string, cnpj: string, email: string, telefone: string, site: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const formatedCnpj = cnpj.replace(/[./-]/g, '');

    if (telefone != null) {
      telefone = telefone.replace(/[\(\)\-\s]/g, '');
    }

    const response = await api.put('empresa/' + id, {
      nomeEmpresa: nome,
      cnpj: formatedCnpj,
      site: site,
      telefone: telefone,
      email: email,
    })

    return response
  }

    // BUSCA UMA EMPRESA ESPECÍFICA PELO ID COM AUTENTICAÇÃO JWT
  async getEmpresa(id: string) {
    const jwt = this.authService.getJwt();

    try {
      const response = await this.api.get(`${this.urlBase}/empresa/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      return response.data; // <-- retorna direto os dados da empresa
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) {
        this.authService.logout();
      }

      console.error("Erro ao buscar empresa:", error);
      return null;
    }
  }

  // LISTA TODAS AS EMPRESAS CADASTRADAS
  async getEmpresas() {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/empresa/')

    return response.data.filter((empresa: any) => !empresa.deletedAt)  ;
  }

  // BUSCA OS REPRESENTANTES ASSOCIADOS A UMA EMPRESA
  async getRepresentantesEmpresaId(id: string) {
    const jwt = this.authService.getJwt();

    try {
      const response = await this.api.get(`/empresa/representantes/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []; // lista vazia, sem erro
      }

      throw error;
    }
  }

  // MARCA UMA EMPRESA COMO DESATIVADA NO SISTEMA
  async desativarEmpresa(id: string) {
    try {
        const jwt = this.authService.getJwt(); 

        const response = await this.api.delete(`/empresa/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return response.data; 
    } catch (error: any) {
        console.error('Erro ao desativar empresa:', error);

        if (error.response) {
            return error.response.data;
        }
        return { data: { message: "Erro ao desativar a empresa. Tente novamente mais tarde." } };
    }
  }


}