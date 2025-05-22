import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// SERVIÇO QUE FAZ A GERENCIA DE CIDADES (FAZ ACESSO A UMA API PARA ISSO)
export class CidadeService {
  private apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios'; // URL da API

  constructor(private http: HttpClient) { }

  // BUSCA TODAS AS CIDADES
  getCidades(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCities(): Observable<string[]> { // Defina o tipo de retorno como Observable<string[]>
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response: any[]) => response.map((item: any) => item.nome))
    );
  }
}
