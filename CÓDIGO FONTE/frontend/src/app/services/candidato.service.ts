import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {

  private readonly urlBase = environment.API

  constructor(private http: HttpClient) { }


  async cadastroCandidato(id: string, nome: string, nomeSocial: string, genero: string, cpf: string, dataNascimento: any, pcd: number, disponibilidade: string, cidadeInteresse: string, vagaInteresse: string, nivelInstrucao: string, cnh: string, pretensaoSalarial: number, telefone: string) {

    const api = axios.create({
      baseURL: this.urlBase
    })

    let pcdBoolean = false

    if (pcd == 1) {
      pcdBoolean = true
    }

    let cpfSemPontosETraço = cpf.replace(/[.-]/g, '');

    if (telefone != null)
      telefone = telefone.replace(/[\(\)\-\s]/g, '')

    const response = await api.post('/candidato', {
      idconta: id,
      nome: nome,
      nomeSocial: nomeSocial ?? null,
      genero: genero,
      cpf: cpfSemPontosETraço,
      nascimento: dataNascimento,
      pcd: pcdBoolean,
      disponibilidade: disponibilidade ?? null,
      cidadeInteresse: cidadeInteresse ?? null,
      tipoVaga: vagaInteresse ?? null,
      pretensaoSalarial: pretensaoSalarial ?? null,
      nivelInstrucao: nivelInstrucao ?? null,
      cnh: cnh ?? null,
      telefone: telefone ?? null

    })
    return response
  }

  async cadastrarAreas(id: string, areas: string[]) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post('candidato/areas/' + id, {
      idconta: id,
      areas: areas
    })

    return response
  }


  async uploadFile(id: string, file: File): Promise<any> {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const formData: FormData = new FormData();

    formData.append('pdf', file, file.name); 

    const response = await api.post('/candidato/cv/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });

    return response;
  }

  async getCandidato(id: string) {
    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.get(this.urlBase + '/candidato/' + id)

    return response.data
  }

  async enviarEmailComCurriculo(idconta: string, idvaga: string, file: File) {

    const api = axios.create({
      baseURL: this.urlBase
    })

    const formData: FormData = new FormData();

    formData.append('pdf', file, file.name);

    const response = await api.post('/enviarEmailComCurriculo/' + idconta + '/' + idvaga,
      formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response
  }

  async enviarEmailComCurriculoDoPerfil(idconta: string, idvaga: string) {

    const api = axios.create({
      baseURL: this.urlBase
    })

    const response = await api.post('/enviarEmailComCurriculoDoPerfil/' + idconta + '/' + idvaga);

    return response
  }

  async updateCandidato(idconta: string, nome: string, nomeSocial: string | null, genero: string, cpf: string, dataNascimento: any, pcd: number, disponibilidade: string | null, cidade: any | null, tipoVaga: string | null, nivelInstrucao: string | null, cnh: string | null, pretensaoSalarial: number | null, telefone: string | null) {

    if (cidade.charAt(0) === ',') {
      cidade = cidade.substring(1)
    }
    
    const api = axios.create({
      baseURL: this.urlBase
    });
    console.log("pcd recebido", pcd)

    let pcdBoolean = false

    if (pcd == 1) {
      pcdBoolean = true
    }

    console.log("pcd", pcdBoolean)

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

  async buscarAreasPorCandidatoId(idconta: string) {
    idconta = idconta.toString()
    console.log("ID RECEBIDO: ", typeof idconta, idconta)
    const api = axios.create({
      baseURL: this.urlBase
    });

    try {
      const response = await api.get('/candidato/areas/' + idconta);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar áreas por ID do candidato:', error);
      throw error;
    }
  }

  async updateAreasDeInteresse(idconta: string, areas: string[]) {
    const api = axios.create({
      baseURL: this.urlBase
    });

    console.log("Areas: ", areas)
    console.log("idconta: ", idconta)
  
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
}
