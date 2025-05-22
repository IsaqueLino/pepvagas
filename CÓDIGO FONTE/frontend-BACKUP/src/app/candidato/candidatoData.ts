import {Regime} from "../../../../shared/enums/Regime";
import {TipoVaga} from "../../../../shared/enums/TipoVaga";
import {Modalidade} from "../../../../shared/enums/Modalidade";
import {TipoUsuario} from "../../../../shared/enums/TipoUsuario";

export interface CandidatoData {

  nome: string;
  nomeSocial: string;
  genero: string;
  cpf: string;
  email: string;
  senha: string;
  tipo: TipoUsuario;
  pretensaoSalarial: number;
  cep: string;
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
