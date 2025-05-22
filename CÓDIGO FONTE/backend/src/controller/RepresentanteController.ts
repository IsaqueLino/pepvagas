import { Request, Response } from "express";
import { Representante } from "../database/models/Representante";
import { AppDataSource } from "../database/data-source";
import { Vaga } from "../database/models/Vaga";

export default{

    async create(request: Request, response: Response) {
        try {
            const {
                idconta,
                nome,
                idEmpresa,
            } = request.body;

            const representanteRepository = AppDataSource.getRepository(Representante);
            const representanteExists = await representanteRepository.findOne({
                where: { idconta },
            });
            if (representanteExists && representanteExists.deletedAt==null) {
                return response.status(409).json({ message: "Representante já cadastrado" });
            }

            const representante = representanteRepository.create({
                idconta,
                nome,
                idEmpresa,
            });
            console.log("New Representante informations:", representante);
            await representanteRepository.save(representante);
            console.log("Representante succesfully created!");
            return response.status(201).json(representante);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async index(request: Request, response: Response) {
        const representanteRepository = AppDataSource.getRepository(Representante);
    
        try {
            const representantes = await representanteRepository
                .createQueryBuilder('representante')
                .withDeleted()
                .getMany();
    
            return response.status(200).json(representantes);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async update(request: Request, response: Response) {
        const {
            idconta,
            nome,
            idEmpresa,
        } = request.body;
        const { id } = request.params;
        const representanteRepository = AppDataSource.getRepository(Representante);
        try {
            const representanteExists = await representanteRepository.findOneBy({ idconta: +id });
            if (!representanteExists) {
                return response.status(404).json({ message: "Representante não cadastrado" });
            }
            representanteExists.nome = nome;
            representanteExists.idEmpresa = idEmpresa;
            console.log("New Informations:", representanteExists);

            await representanteRepository.save(representanteExists);
            console.log("Succesfully Saved!");
            return response.status(200).json(representanteExists);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const representanteRepository = AppDataSource.getRepository(Representante);
            const vagaRepository = AppDataSource.getRepository(Vaga);

            const representante = await representanteRepository.findOneBy({ idconta: +id });
    
            if (!representante) {
                return response.status(404).json({ message: "Representante não encontrado" });
            }
            
            //Check if there are Vagas with this Representante
            const vagasDoRepresentante = await representanteRepository.createQueryBuilder("representante")
            .leftJoinAndSelect("representante.vagas", "vaga")
            .where("representante.idconta = :id", { id: representante.idconta })
            .getMany();

            if (vagasDoRepresentante.length > 0) {
                     return response.status(400).json({ message: "Não é possível deletar o representante. Existem vagas atreladas a ele." });
            }
    
            representante.deletedAt = new Date();
            await representanteRepository.save(representante);
    
            return response.status(200).json({ message: "Representante deletado" });
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },
    

    async findById(request: Request, response: Response) {
        const { id } = request.params;
        const representanteRepository = AppDataSource.getRepository(Representante);
        
        try {
            const representante = await representanteRepository.findOne({
                where: { idconta: +id },
                relations: ["idEmpresa"], // Adiciona as relações 'conta' e 'idEmpresa'
                withDeleted: true
            });
    
            if (!representante) {
                return response.status(404).json({ message: "Representante não encontrado" });
            }
    
            return response.status(200).json(representante);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    
}
