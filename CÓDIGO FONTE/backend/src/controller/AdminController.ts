import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Administrador } from "../database/models/Administrador";
import { Vaga } from "../database/models/Vaga";

export default {

    async create(request: Request, response: Response) {
        try {
            const {
                idconta,
                nome,
            } = request.body;

            const adminRepository = AppDataSource.getRepository(Administrador);
            const adminExists = await adminRepository.findOne({
                where: { idconta: idconta },
            });
            console.log(adminExists);
            if (adminExists && !adminExists.deletedAt) {
                return response.status(409).json({ message: "Administrador já cadastrado" });
            }

            const admin = adminRepository.create({
                idconta,
                nome
            });

            console.log("New Administrator informations:", admin);
            await adminRepository.save(admin);
            console.log("Administrator succesfully created!");
            return response.status(201).json(admin);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async index(request: Request, response: Response) {
        const adminRepository = AppDataSource.getRepository(Administrador);

        try {
            const administradores = await adminRepository.find();

            return response.status(200).json(administradores);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const adminRepository = AppDataSource.getRepository(Administrador);
        const admin = await adminRepository.findOneBy({ idconta: +id });
        if (!admin) {
            return response.status(404).json({ message: "Usuário não encontrado" });
        }

        //se existir alguma vaga com esse administrador, não pode deletar
        const vagaRepository = AppDataSource.getRepository(Vaga);
        const vaga = await vagaRepository.findOneBy({ idVaga: +id });

        if (vaga) {
            return response.status(422).json({ message: "Não é possível deletar o usuário. Ainda há vagas associadas a ele" });
        }

        admin.deletedAt = new Date();
        await adminRepository.save(admin);
        return response.status(200).json({ message: "Usuário deletado" });
    },

    async find(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const adminRepository = AppDataSource.getRepository(Administrador);

            const admin = await adminRepository.findOneBy({ idconta: +id });
            if (!admin) {
                return response.status(404).json({ message: "Administrador não encontrado" });
            }
            return response.status(200).json(admin);

        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    async update(request: Request, response: Response) {
        const {
            idconta,
            nome,
        } = request.body;

        const { id } = request.params;
        const adminRepository = AppDataSource.getRepository(Administrador);
        try {
            const adminExists = await adminRepository.findOneBy({ idconta: +id });
            if (!adminExists) {
                return response.status(404).json({ message: "Administrador não cadastrado" });
            }

            //adminExists.idconta = idconta;
            console.log("ID:", idconta);
            console.log("ID:", adminExists.idconta);
            adminExists.nome = nome;
            console.log("New Informations:", adminExists);

            await adminRepository.save(adminExists);
            console.log("Successfully Saved!");
            return response.status(200).json(adminExists);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
