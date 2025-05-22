import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

// SERVIÇO QUE FAZ A GERENCIA DE INFORMAÇÕES DO USUÁRIO (CANDIDATO)
export class CandidatoService {

  private readonly urlBase = environment.API

  constructor(private http: HttpClient, private authService: AuthService ) { }

  //VERIFICA A EXISTÊNCIA DE UM CPF JÁ CADASTRADO NO BANCO
  async verificarCPFRepetido(cpf: string) {

    const api = axios.create({
      baseURL: this.urlBase
    });
  
    try {
      const response = await api.get(`/candidato/cpf/${cpf}`);
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
        console.error("Erro ao verificar CPF:", error);
        throw new Error("Erro ao verificar CPF no servidor");
      }
    }
  }

  async cadastroCandidato(id: string, nome: string, nomeSocial: string, genero: string, cpf: string, dataNascimento: any, pcd : number, disponibilidade : string, cidadeInteresse : string, vagaInteresse : string, nivelInstrucao : string, cnh : string, pretensaoSalarial : number, telefone : string){

    const api = axios.create({
      baseURL : this.urlBase
    })

    let pcdBoolean = false

    if(pcd == 1){
      pcdBoolean = true
    }

    let cpfSemPontosETraço = cpf.replace(/[.-]/g, '');

    if(telefone != null)
      telefone = telefone.replace(/[\(\)\-\s]/g, '')

    const response = await api.post('/candidato',{
      idconta : id,
      nome : nome,
      nomeSocial : nomeSocial ?? null,
      genero : genero,
      cpf : cpfSemPontosETraço,
      nascimento : dataNascimento,
      pcd : pcdBoolean,
      disponibilidade : disponibilidade ?? null,
      cidadeInteresse : cidadeInteresse ?? null,
      tipoVaga : vagaInteresse ?? null,
      pretensaoSalarial : pretensaoSalarial ?? null,
      nivelInstrucao : nivelInstrucao ?? null,
      cnh : cnh ?? null,
      telefone : telefone ?? null

    })
    return response
  }

  async cadastrarAreas(id : string, areas: string[]){
    const api = axios.create({
      baseURL : this.urlBase
    })

    const response = await api.post('candidato/areas/' + id, {
      idconta : id,
      areas : areas
    })

    return response
  }

  async getCandidaturas(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });

    try {
      const response = await api.get(`/candidato/${id}/candidaturas`);
      return response.data; // resposta agora são as vagas associadas ao candidato
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      throw error;
    }
  }

  // FAZ O UPLOAD DO CURRÍCULO DO CANDIDATO NA BASE DE CURRÍCULOS
  async uploadFile(id: string, file: File): Promise<any> {
    const api = axios.create({
      baseURL : this.urlBase
    })

    const formData: FormData = new FormData();

    formData.append('pdf', file, file.name); // Altere 'file' para 'pdf' como nome do campo no FormData

    const response = await api.post('/candidato/cv/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Certifique-se de definir o tipo de conteúdo corretamente
      }
    });

    return response;
  }

  // REMOVE O CURRÍCULO DO CANDIDATO DA BASE DE CURRÍCULOS
  async deleteFile(id: string | null): Promise<any> {
    const api = axios.create(
      {
        baseURL : this.urlBase
      }
    )

    try {
      const response = await api.delete('/candidato/cv/delete/' + id);
      return response.data; // resposta da api
    } catch (error: any) {
      console.error('Erro ao remover currículo:', error);
      if (error.response && error.response.data && error.response.data.message) {
        return { erro: true, message: error.response.data.message };
      }
  
      // Caso genérico
      return { erro: true, message: 'Erro desconhecido ao remover currículo.' };
    }
  }

  // BUSCA O CURRÍCULO DO CANDIDATO DA BASE DE CURRÍCULOS
  async getFile(id: string | null): Promise<any> {
  const api = axios.create({
    baseURL: this.urlBase,
    responseType: 'blob'
  });

  try {
    const response = await api.get('/candidato/cv/get/' + id);
    return response;
  } catch (error: any) {
    console.error('Erro ao obter currículo:', error);

    // Trata erro que veio como blob
    if (error.response && error.response.data) {
      try {
        const text = await error.response.data.text(); // converte blob para texto
        const json = JSON.parse(text); // tenta converter para JSON
        return { erro: true, message: json.message || 'Erro desconhecido' };
      } catch (e) {
        return { erro: true, message: 'Erro ao processar resposta do servidor.' };
      }
    }

    return { erro: true, message: 'Erro desconhecido ao obter currículo.' };
  }
}
  // BUSCA UM CANDIDATO COM BASE NO ID
  async getCandidato(id: string){
    const api = axios.create({
      baseURL : this.urlBase
    })

    const response = await api.get(this.urlBase + '/candidato/' + id)

    return response.data
  }

  // ENVIA OUTRO CURRÍCULO PARA A EMPRESA DETENTORA DA VAGA
  async enviarEmailComCurriculo(idconta: string, idvaga: string, file: File){

    const api = axios.create({
      baseURL : this.urlBase
    })

    const formData: FormData = new FormData();

    formData.append('pdf', file, file.name);

    const response = await api.post('/enviarEmailComCurriculo/'+idconta+'/'+idvaga,
    formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response
  }

  // ENVIA CURRÍCULO DA BASE PARA A EMPRESA DETENTORA DA VAGA
  async enviarEmailComCurriculoDoPerfil(idconta: string, idvaga: string){

    const api = axios.create({
      baseURL : this.urlBase
    })

    const response = await api.post('/enviarEmailComCurriculoDoPerfil/'+idconta+'/'+idvaga);

    return response
  }

  // ATUALIZA OS DADOS DO CANDIDATO
  async updateCandidato(idconta: string, nome: string, nomeSocial: string | null, genero: string, cpf: string, dataNascimento: any, pcd: number, disponibilidade: string | null, cidade: any | null, tipoVaga: string | null, nivelInstrucao: string | null, cnh: string | null, pretensaoSalarial: number | null, telefone: string | null) {

    if (cidade.charAt(0) === ',') {
      cidade = cidade.substring(1)
    }

    const api = axios.create({
      baseURL: this.urlBase
    });

    let pcdBoolean = false

    if(pcd == 1){
      pcdBoolean = true
    }

  
    const formatedCpf = cpf.replace(/[.-]/g, '');
  
    if (telefone != null) {
      telefone = telefone.replace(/[\(\)\-\s]/g, '');
    }
    
    try {
      const response = await api.put('/candidato/' + idconta, {
        nome: nome,
        nomeSocial: nomeSocial ?? null,
        genero: genero,
        cpf: formatedCpf,
        nascimento: dataNascimento,
        pcd: pcdBoolean,
        disponibilidade: disponibilidade ?? null,
        cidadeInteresse: cidade ?? null,
        tipoVaga: tipoVaga ?? null,
        pretensaoSalarial: pretensaoSalarial ?? null,
        nivelInstrucao: nivelInstrucao ?? null,
        cnh: cnh ?? null,
        telefone: telefone ?? null
      });
  
      return response;
    } catch (error) {
      console.error('Erro ao realizar a alteração do candidato:', error);
      throw error;
    }
  }

  // BUSCA ÁREAS PELO ID DO CANDIDATO
  async buscarAreasPorCandidatoId(idconta: string) {
    const api = axios.create({
      baseURL: this.urlBase
    });

    try {
      // Usar o endpoint que já retorna as áreas junto com os dados do candidato
      const response = await api.get('/candidato/' + idconta);
      return response.data.areas; // Retorna apenas o array de áreas
    } catch (error) {
      console.error('Erro ao buscar áreas do candidato:', error);
      throw error;
    }
  }
  
  // ATUALIZA ÁREAS DE INTERESSE DO USUÁRIO
  async updateAreasDeInteresse(idconta: string, areas: string[]) {
    const api = axios.create({
      baseURL: this.urlBase
    });


    try {
      const response = await api.put('/candidato/areas/editar/' + idconta, {
        areas: areas
      });
      return response;
    } catch (error) {
      console.error('Erro ao atualizar áreas de interesse do candidato:', error);
      throw error;
    }
  }

  // desativa candidato
  async desativarCandidato(id: string) {
    try {
      const jwt = this.authService.getJwt();
  
      const api = axios.create({ baseURL: this.urlBase });
  
      const response = await api.delete(`/candidato/${id}`, {
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
  
      return { data: { message: "Erro ao desativar o candidato. Tente novamente mais tarde." } };
    }
  }
  
}
