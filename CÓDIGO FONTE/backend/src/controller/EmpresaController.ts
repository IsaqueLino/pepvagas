import { Request, Response } from "express";
import { Empresa } from "../database/models/Empresa";
import { AppDataSource } from "../database/data-source";
import { Representante } from "../database/models/Representante";
import { Vaga } from "../database/models/Vaga";
import { IsNull } from "typeorm";

export default{

    async create(request: Request, response: Response) {
        const {
            idconta,
            nomeEmpresa,
            cnpj,
            site,
            telefone,
            email,
        } = request.body;

        const empresaRepository = AppDataSource.getRepository(Empresa);

        const empresaWithEmail = await empresaRepository.findOne({ where: { idconta } });
        const empresaWithCNPJ = await empresaRepository.findOne({ where: { cnpj } });

        if (empresaWithEmail && empresaWithEmail.deletedAt == null) {
            return response.status(409).json({ message: "Empresa com a mesma conta já cadastrada." });
        }

        if (empresaWithCNPJ && empresaWithCNPJ.deletedAt == null) {
            return response.status(409).json({ message: "Empresa com o mesmo CNPJ já cadastrada" });
        }

        try {
            const empresa = empresaRepository.create({
                idconta,
                nomeEmpresa,
                cnpj,
                site,
                telefone,
                email,
            });

            // Salve a empresa no banco de dados
            await empresaRepository.save(empresa);

            return response.status(201).json(empresa);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "Erro interno no servidor" });
        }
    },


    async index(request: Request, response: Response) {
        const empresaRepository = AppDataSource.getRepository(Empresa);

        try {
            const empresas = await empresaRepository
                .createQueryBuilder('empresa')
                .withDeleted()
                .getMany();

            return response.status(200).json(empresas);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "Erro interno no servidor" });
        }
    },

    async update(request: Request, response: Response) {
        try{

            const {
                nomeEmpresa,
                cnpj,
                site,
                telefone,
                email,
            } = request.body;
            const { id } = request.params;
            const empresaRepository = AppDataSource.getRepository(Empresa);

            const empresaExists = await empresaRepository.findOneBy({ idconta: +id });
            if (!empresaExists) {
                return response.status(404).json({ message: "Empresa não cadastrada" });
            }
            console.log('Empresa encontrada:', empresaExists);
            const empresaWithEmail = await empresaRepository.findOne({ where: { email } });
            const empresaWithCNPJ = await empresaRepository.findOne({ where: { cnpj } });

            if (empresaWithEmail && empresaWithEmail.deletedAt == null && empresaWithEmail.idconta !== empresaExists.idconta) {
                return response.status(409).json({ message: "Empresa com o mesmo email de contato já cadastrada" });
            }

            if (empresaWithCNPJ && empresaWithCNPJ.deletedAt == null && empresaWithCNPJ.idconta !== empresaExists.idconta) {
                return response.status(409).json({ message: "Empresa com o mesmo CNPJ já cadastrada" });
            }

                empresaExists.nomeEmpresa = nomeEmpresa;
                empresaExists.cnpj = cnpj;
                empresaExists.email = email;
                empresaExists.site = site;
                empresaExists.telefone = telefone
                console.log('Dados novos:', empresaExists);

                const empresa = empresaRepository.create(empresaExists);
                await empresaRepository.save(empresa);
                return response.status(200).json(empresa);
        } catch (error) {
            console.error("Error durante a alteração dos dados:", error);
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const empresaRepository = AppDataSource.getRepository(Empresa);
        const representanteRepository = AppDataSource.getRepository(Representante);
        const vagaRepository = AppDataSource.getRepository(Vaga);
    
        const empresa = await empresaRepository.findOne({ where: { idconta: +id } });
    
        if (!empresa) {
            return response.status(404).json({ message: "Empresa não encontrada" });
        }
    
        try {
            // Verificar se todos os representantes têm deletedAt preenchido
            const representantes = await representanteRepository
                .createQueryBuilder("representante")
                .where("representante.empresa = :idconta", { idEmpresa: empresa.idconta })
                .getMany();
    
            const todosRepresentantesDeletados = representantes.every(representante => representante.deletedAt !== null);
    
            if (!todosRepresentantesDeletados) {
                return response.status(400).json({ message: "Não é possível deletar a empresa. Ainda há representantes ativos." });
            }
    
            // Verificar se existem vagas ativas associadas à empresa
            const vagasAtivas = await vagaRepository
                .createQueryBuilder("vaga")
                .where("vaga.idConta = :idconta AND vaga.deletedAt IS NULL AND vaga.data_limite >= CURRENT_DATE", { idEmpresa: empresa.idconta })
                .getCount();
    
            if (vagasAtivas > 0) {
                return response.status(401).json({ message: "Não é possível deletar a empresa. Ainda há vagas ativas associadas." });
            }
    
            // Agora, você pode marcar a empresa como deletada
            empresa.deletedAt = new Date();
            await empresaRepository.save(empresa);
    
            return response.status(200).json({ message: "Empresa deletada" });
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async findById(request: Request, response: Response) {
        const { id } = request.params;
        const empresaRepository = AppDataSource.getRepository(Empresa);

        try {
            const empresa = await empresaRepository.findOne({ where: {idconta: +id }, withDeleted: true});

            if (!empresa) {
                return response.status(404).json({ message: "Empresa não encontrada" });
            }

            return response.status(200).json(empresa);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async getRepresentantesByEmpresaId(request: Request, response: Response) {
        const { id } = request.params;
        const representanteRepository = AppDataSource.getRepository(Representante);

        try {
            console.log('ID da empresa:', id); // Adicione este log para depurar

            const representantes = await representanteRepository.find({
                where: {
                    idEmpresa: {
                        idconta: +id
                    },
                    conta: !null
                },
                relations: ["idEmpresa", "conta"]
            });

            console.log('Representantes encontrados:', representantes); // Adicione este log para depurar

            if (representantes.length === 0) {
                return response.status(404).json({ message: "Nenhum representante encontrado para esta empresa" });
            }

            return response.status(200).json(representantes);
        } catch (error) {
            console.error("Erro ao buscar representantes:", error);
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    
}
