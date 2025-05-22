import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from './axios';
import { AxiosError } from 'axios';

const urlBase = "https://brasilapi.com.br/api/cep/v1";

@Injectable({
    providedIn: 'root',
})

export class ConsultCepService {

    constructor(private http: HttpClient) { }

    async getCep(cep: string) {

        try {
            const response = await api.get(`${urlBase}/${cep}`);

            if (response.status === 200) {
                return response.data;
            } 

            return false;
        } catch (error) {

            if (error instanceof AxiosError) {
                return false;
            }

        }
    }

    async getCep2(cep: string) {
        const responseListCeps = await api.get('/list-ceps');
        if (responseListCeps.status === 200) {
            const ceps = responseListCeps.data;
            const cepEncontrado = ceps.find((cepItem: any) => {
                return cepItem.cep === cep;
            });

            if (cepEncontrado) {
                return cepEncontrado;
            }

            return false;
        }

    }

}
