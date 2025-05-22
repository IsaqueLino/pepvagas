import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios'; // URL DA API DO IBGE PARA MUNICÍPIOS DE SP (ESTADO 35)

  constructor(private http: HttpClient) { }

  // OBTÉM A LISTA COMPLETA DE CIDADES COM TODOS OS DADOS DA API
  getCidades(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // OBTÉM APENAS OS NOMES DAS CIDADES, TRANSFORMANDO A RESPOSTA EM UM ARRAY DE STRINGS
  getCities(): Observable<string[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response: any[]) => response.map((item: any) => item.nome))
    );
  }
}
