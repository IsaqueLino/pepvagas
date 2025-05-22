export interface EmpresaData {
    nomeEmpresa: string;
    cnpj: string;
    email: string;
    senha: string;
    cep: string;
    uf:string;
    cidade: string;
    logradouro: string;
    numero:string;
    complemento: string;
    tipo: string;
    site: string;
    idArea: number;
    contatos: Contato[] ;
}

export interface Contato {
    tipoContato: string;
    contato: string;
}

export interface CEP{
    cep: string;
    uf: string;
    cidade: string;
    logradouro: string;
    numero:string;
}