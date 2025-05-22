import { AppDataSource } from "../database/data-source";
import { Request, Response } from "express";
import { Equipe } from "../database/models/Equipe";
import { Vaga } from "../database/models/Vaga";

export default {
    async create(request: Request, response: Response) {
        try {
            const {
                nome,
                idconta,
            } = request.body;

            const equipeRepository = AppDataSource.getRepository(Equipe);
            const equipeExists = await equipeRepository.findOne({
                where: { idconta },
            });
            if (equipeExists && equipeExists.deletedAt == null) {
                return response.status(409).json({ message: "Membro da Equipe já cadastrado" });
            }

            const equipe = equipeRepository.create({
                nome,
                idconta
            });

            console.log("New Equipe Member informations:", equipe);
            await equipeRepository.save(equipe);
            console.log("Equipe member succesfully created!");

            return response.status(201).json(equipe);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async index(request: Request, response: Response) {

        try {
            const equipeRepository = AppDataSource.getRepository(Equipe);
            const membros = await equipeRepository
                .createQueryBuilder('equipe')
                .withDeleted()
                .getMany();
            return response.status(200).json(membros);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const equipe = await equipeRepository.findOneBy({ idconta: + id });
        if (!equipe) {
            return response.status(404).json({ message: "Membro da Equipe não encontrado" });
        }
        equipe.deletedAt = new Date();
        await equipeRepository.save(equipe);
        return response.status(200).json({ message: "Membro da Equipe deletado" });
    },

    async find(request: Request, response: Response) {
        const { id } = request.params;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        try {
            const equipe = await equipeRepository.findOneBy({ idconta: +id });
            if (!equipe) {
                return response.status(404).json({ message: "Membro da Equipe não encontrado" });
            }
            return response.status(200).json(equipe);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async update(request: Request, response: Response) {
        const {
            nome
        } = request.body;

        const { id } = request.params;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        try {
            console.log("ID do membro da equipe:", id);
            const equipeExists = await equipeRepository.findOneBy({ idconta: + id });
            if (!equipeExists) {
                return response.status(404).json({ message: "Membro de Equipe não encontrado" });
            }
            else {
                console.log("Membro da equipe encontrado:", equipeExists);
            }

            equipeExists.nome = nome;

            console.log("New Informations:", equipeExists);

            await equipeRepository.save(equipeExists);
            console.log("Successfully Saved!");
            return response.status(200).json(equipeExists);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async publishVaga(request: Request, response: Response) {
        const { id } = request.params;
        const { idVaga } = request.body;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const vagaRepository = AppDataSource.getRepository(Vaga);
        try {
            const equipe = await equipeRepository.findOneBy({ idconta: + id });
            if (!equipe) {
                return response.status(404).json({ message: "Membro da Equipe não encontrado" });
            }
            const vaga = await vagaRepository.findOneBy({ idVaga: + idVaga });
            if (!vaga) {
                return response.status(404).json({ message: "Vaga não encontrada" });
            }
            vaga.conta = equipe.conta;
            await vagaRepository.save(vaga);
            return response.status(200).json(vaga);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
