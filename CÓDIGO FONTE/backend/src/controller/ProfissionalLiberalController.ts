import e, {Request, Response} from "express";
import {AppDataSource} from "../database/data-source";
import * as bcrypt from "bcrypt";
import {hash} from "bcrypt";
import {ProfissionalLiberal} from "../database/models/ProfissionalLiberal";
import {TipoServico} from "../database/models/TipoServico";
import {Not} from "typeorm";
import { z } from "zod"
import fs from 'fs'
import { In } from 'typeorm';
import { generatePassword, sendEmail } from "./EmailController";

export default  {

    async sendImage(request: Request, response: Response){
        const { idconta } = request.params
        const imagem = request.file

        const proficionalLiberalRepository = AppDataSource.getRepository(ProfissionalLiberal)

        const proficionalLiberal = await proficionalLiberalRepository.findOneBy({ idconta: +idconta})

        if(!proficionalLiberal)
            return response.status(404).json({message: "Não existe um proficional liberal com este ID"})

        if(!imagem) 
            return response.status(400).json({message: "A imagem do proficional liberal deve ser enviada."})
        
        console.log("teste" + imagem.filename)

        if (proficionalLiberal.arquivoImagem != null){
            fs.unlink( __dirname+"/../../uploads/"+  proficionalLiberal.arquivoImagem, (err) => {
                if (err) {
                    console.log(err)
                    return
                }
            })
        }

        proficionalLiberal.arquivoImagem = imagem.filename

        await proficionalLiberalRepository.save(proficionalLiberal)

        return response.status(200).json({message: "Imagem do profissional liberal foi adicionada com sucesso."})
        
    },

    async findTipoByProfissionalId(request: Request, response: Response) {
        const { idconta } = request.params;
    
        if (!idconta) {
            return response.status(400).json({ message: "ID do profissional não fornecido" });
        }
    
        try {
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissional = await profissionalRepository.findOne({
                where: { idconta: +idconta },
                relations: ["tipoServicos"]
            });
    
            if (!profissional) {
                return response.status(404).json({ message: "profissional não encontrado" });
            }
    
            return response.status(200).json(profissional.tipoServicos);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno no servidor" });
        }
    },


    async create(request: Request, response: Response) {
        const {idconta, nome, nomeSocial, descricao, telefone, email} = request.body
  
        const dadosObrigatorios = z.object({
            idconta : z.string({required_error: "O id da conta é requerido"}),
            nome : z.string({ required_error: "O nome do proficional é requerido"}),
            descricao : z.string({ required_error: "A descrição deve é requerida"}),
            telefone : z.string({required_error: "O telefone é requerido"}).length(11),
            email : z.string({required_error: "O email é requerido"})
        })

        const dadosOpcionais = z.object({
            nomeSocial : z.string().nullable(),
        })
        
        dadosObrigatorios.parse(request.body)
        dadosOpcionais.parse(request.body)

        try {
            
            const profissionalLiberalRepository = AppDataSource.getRepository(ProfissionalLiberal)

            const contaExistente = await profissionalLiberalRepository.findOne({where : {idconta : +idconta}})

            console.log(contaExistente)
            
            const telefoneExistente = await profissionalLiberalRepository.findOne({ where: { telefone: telefone } });

            if(telefoneExistente)
                return response.status(404).json({menssage : "Já existe um Proficional cadastro com esse numero de telefone"})

            if(contaExistente != null)
                return response.status(404).json({menssage : "Não existe uma conta com o id informado"})
            
            const novoProficionalLiberal = profissionalLiberalRepository.create({
                idconta, nome, nomeSocial, descricao,telefone, email
            })

            await profissionalLiberalRepository.save(novoProficionalLiberal)

            return response.status(201).json({message: "Profissional cadastrado com sucesso"});
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao cadastrar profissional", error: error});
        }
    },



    async index(request: Request, response: Response) {
        try {
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissionais = await profissionalRepository.find();
            return response.status(200).json(profissionais);

        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao listar profissionais", error: error});
        }
    },


    async indexAll(request: Request, response: Response) {
        try {
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissionais = await profissionalRepository.find({withDeleted: true});
            return response.status(200).json(profissionais);

        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao listar profissionais", error: error});
        }
    },

    async findById(request: Request, response: Response) {
        
        const {id} = request.params;

        const findSchema = z.object({
            id: z.string({required_error: "O id é requerido"})
        })
        
        try {
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissional = await profissionalRepository.findOne({where: {idconta: +id}});
            
            if (!profissional) {
                return response.status(404).json({message: "Profissional não encontrado"});
            }

            return response.status(200).json(profissional);

        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao listar profissional", error: error});
        }
    },


    async update(request: Request, response: Response) {
        const {id} = request.params;
        
        const {nome, nomeSocial, descricao, telefone, email} = request.body

        const dadosObrigatorios = z.object({
            id : z.string({required_error: "O id é requerido"})
        })

        const dadosOpcionais = z.object({
            nome : z.string().nullable(),
            nomeSocial : z.string().nullable(),
            descricao : z.string().nullable(),
            telefone : z.string().length(11).nullable(),
            email : z.string().nullable()
        })

        try {
            dadosObrigatorios.parse(request.params)
            dadosOpcionais.parse(request.body)
            
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);

            const profissionalExists = await profissionalRepository.findOneBy({idconta: +id});

            console.log("proficional " + profissionalExists)

            if (!profissionalExists) {
                return response.status(404).json({message: "Profissional não encontrado"});
            }

            profissionalExists.nome = nome
            profissionalExists.nomeSocial = nomeSocial
            profissionalExists.descricao = descricao
            profissionalExists.telefone = telefone
            profissionalExists.email = email
            
            await profissionalRepository.save(profissionalExists);

            return response.status(200).json(profissionalExists);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro interno no servidor"});
        }
    },

    async cadastroTipo(request: Request, response: Response){
        const { idconta } = request.params;
        const { tipo } = request.body;

        const idSchema = z.object({
            idconta : z.string({ required_error : "O id é requerido"})
        })

        try{

            idSchema.parse(request.params)

            const proficionalLiberalRepository = AppDataSource.getRepository(ProfissionalLiberal)
            const tipoServicoRepository = AppDataSource.getRepository(TipoServico)

            const proficional = await proficionalLiberalRepository.findOne({
                where: {
                    idconta: +idconta
                }
            });

            if(!proficional){
                return response.status(404).json({ message: "Proficional liberal não encontrado" });
            }

            const tipoServico = await tipoServicoRepository.find({
                where: {
                    nome: In(tipo)
                }
            });

            if(tipo.length !== tipoServico.length){
                return response.status(400).json({ message: "Uma ou mais tipo de serviço não foram encontrados" });
            }

            proficional.tipoServicos = tipoServico

            await proficionalLiberalRepository.save(proficional)

            return response.status(200).json({ message: "TIpos de serviços cadastradas com sucesso para o proficional liberal" });

        }catch(error){
            console.log(error);
            return response.status(500).json({ message: "Erro interno no servidor" });
        }
        
    },

    async delete(request: Request, response: Response) {
        const {id} = request.params;

        const dadosObrigatorios = z.object({
            id : z.string({required_error: "O id é requerido"})
        })

        try {
            dadosObrigatorios.parse(request.params)

            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);

            const profissional = await profissionalRepository.findOneBy({idconta: +id});

            if (!profissional) 
                return response.status(404).json({message: "Profissional não encontrado"});

            return response.status(200).json({message: "Profissional deletado com sucesso"});

        } catch (error) {
            console.error(error)
            return response.status(500).json({message: "Erro ao deletar profissional", error: error});
        }
    },

}