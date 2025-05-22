import { TipoUsuario } from "../../../../shared/enums/TipoUsuario";

export interface VagaData {
    titulo_vaga: string;
    tipo_vaga: string;
    regime: string;
    modalidade: string;
    descricao: string;
    salario: number;
    cep: string;
    cidade: string;
    logradouro: string;
    numero: string;
    complemento: string;
    uf: string;
    pcd: number;
    data_limite: Date;
    cnh: string;
    imagem?: object | null;
    site: string;
    email_curriculo: string;
    contato: string;
    idAdministrador: number;
    idEquipe: number;
    idArea: number;
    idEmpresa: number;
    idRepresentante: number;
    candidatos?: Candidato[];
}


export interface Candidato {

    nome: string;
    nomeSocial: string;
    genero: string;
    cpf: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
    pretensaoSalarial: number;
    cep: number;
    cidade: string;
    logradouro: string;
    numero: string;
    complemento: string | null;
    uf: string;
    disponibilidade: string;
    cnh: string;
    nivelInstrucao: string;
    dataNascimento: string;
    regiaoInteresse: boolean;
    cepInteresse: number | null;
    cidadeInteresse: string | null;
    ufInteresse: string | null;
    modalidadeInteresse: string;
    regimeInteresse: string;
    tipoVagaInteresse: string;
    areas: string;
    curriculo: object | null;
    pcd: object | null;
    deletedAt: Date | null;
    contatos: any[];
}


export interface CEP{
    cep: string;
    uf: string;
    cidade: string;
    logradouro: string;
    numero:string;
}