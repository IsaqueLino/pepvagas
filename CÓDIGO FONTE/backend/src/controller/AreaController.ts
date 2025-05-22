import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Area } from "../database/models/Area";
import { z } from "zod"

export default {

    async create(request: Request, response: Response) {
        const { nome } = request.body;

        const areaSchema = z.object({
            nome: z.string({
                required_error: "o nome da area é requerido",
                invalid_type_error: "o nome da area deve ser uma string"
            })
        });

        try {
            areaSchema.parse(request.body)
            const areaRepository = AppDataSource.getRepository(Area);
            const areaExists = await areaRepository.findOne({ where: { nome }});

            if (areaExists) {
                return response.status(422).json({ message: "Área já cadastrada" });
            }
            const newArea = areaRepository.create({
                nome
            });

            const newAreaId = await areaRepository.save(newArea);
            return response.status(201).json({message: "Área criada com sucesso", id: newAreaId.idArea });

        } catch (error: any){

            let errors: string[] = [];
            error.issues.forEach((issue: any) => {
                errors.push(issue.message)
            });

            return response.status(400).json({
                messages: errors
            })
        }
        
    },

    async index(request: Request, response: Response) {
        try {
            const areaRepository = AppDataSource.getRepository(Area);
            const areas = await areaRepository.find()
            return response.status(200).json(areas);

        } catch (error: any) {
            let errors: string[] = [];
            error.issues.forEach((issue: any) => {
                errors.push(issue.message)
            });

            return response.status(400).json({
                messages: errors
            })
        }
    },

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const deleteSchema = z.object({
            id: z.string({
                required_error: "Id é requerido"
            })
        })
        
        try {
            const deletedDate = new Date()

            deleteSchema.parse(request.params)

            const areaRepository = AppDataSource.getRepository(Area);

            // Verificar se a área existe
            const area = await areaRepository.findOneBy({ idArea: +id });
            if (!area) {
                return response.status(404).json({ message: "Área não encontrada" });
            }

            // Verificar se há vagas associadas à área
            if (area.vagas != null) {
                return response.status(422).json({ message: "Não é possível deletar a área. Ainda há vagas associadas a ela" });
            }

            // Verifica se há candidatos associados à área
            if(area.candidatos != null){
                return response.status(422).json({message: "Não é possicel deletar a área. Ainda tem candidatos associados a ela"})
            }
    
            // Remover a área
            area.deletedAt = deletedDate;
            await areaRepository.save(area);

            return response.status(200).json({ message: "Área deletada com sucesso" });            

        } catch (error: any) {
            console.log(error)
            let errors: string[] = [];
            error.issues.forEach((issue: any) => {
                errors.push(issue.message)
             });

            return response.status(400).json({
                messages: errors
            })
        }
    },

    async update(request: Request, response: Response) {
        const { id } = request.params
        const { nome } = request.body;

        const updateId= z.object({
            id: z.string({
                required_error: "Id é requerido"
            }),
        })

        const updateNome = z.object({
            nome: z.string({
                required_error: "O nome é Requerido"
            })
        })

        try {
            updateId.parse(request.params)
            updateNome.parse(request.body)

            const areaRepository = AppDataSource.getRepository(Area);
            const area = await areaRepository.findOneBy({ idArea: +id });

            if (!area) {
                return response.status(404).json({ message: "Área não encontrada" });
            }
            // Verifique se já existe outra área com o mesmo nome
            const areaWithSameName = await areaRepository.findOne({ where: { nome } });

            if (areaWithSameName && areaWithSameName.idArea !== area.idArea) {
                return response.status(422).json({ message: "Nome de área já existe" });
            }

            area.nome = nome;
            await areaRepository.save(area);
            return response.status(200).json(area);

        } catch (error: any) {
            let errors: string[] = [];
            error.issues.forEach((issue: any) => {
                errors.push(issue.message)
            });

            return response.status(400).json({
                messages: errors
            })
        }
    },
    
    async findById(request: Request, response: Response) {
        const { id } = request.params;
        
        const findSchema = z.object({
            id: z.string({
                required_error: "Id é requerido"
            })
        })

        try {
            findSchema.parse(request.params)
            
            const areaRepository = AppDataSource.getRepository(Area);
            const area = await areaRepository.findOneBy({ idArea: +id });

            if (!area) {
                return response.status(404).json({ message: "Área não encontrada" });
            }

            return response.status(200).json(area);

        } catch (error: any) {
            let errors: string[] = [];
            error.issues.forEach((issue: any) => {
                errors.push(issue.message)
            });

            return response.status(400).json({
                messages: errors
            })
        }
    }

}