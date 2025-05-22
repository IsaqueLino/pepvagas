import { Router } from "express";
import AdminController from "./controller/AdminController";
import AreaController from "./controller/AreaController";
import EquipeController from "./controller/EquipeController";
import authentication from "./middleware/authentication";
import TipoServicoController from "./controller/TipoServicoController";
import ContaController from "./controller/ContaController";
import AuthController from "./controller/AuthController";
import CandidatoController from "./controller/CandidatoController";
import VagaController from "./controller/VagaController";
import RepresentanteController from "./controller/RepresentanteController";
import EmpresaController from "./controller/EmpresaController";

import uploadConfig from './config/multer'
import multer from "multer";
import ProfissionalLiberalController from "./controller/ProfissionalLiberalController";

const routes = Router();
const upload = multer(uploadConfig)  

/* Auth */
routes.post("/login", AuthController.login)
// routes.post("/check-user-google", AuthController.checkUserGoogle);
// routes.get("/refresh-token", AuthController.refreshToken);

/* Conta */
routes.get("/conta", ContaController.index)
routes.get("/conta/:id", ContaController.getById)
routes.get("/contas/deletadas", ContaController.indexDeleted)
routes.post("/conta", ContaController.create)
routes.put("/conta/senha/:id", ContaController.updatePassword)
routes.put("/conta/email/:id", ContaController.updateEmail)
routes.delete("/conta/:id", ContaController.delete)
routes.post("/conta/recuperacao", ContaController.recuperarSenha)
routes.get("/conta/email/:email", ContaController.getByEmail)

/* Administrador */
routes.post("/admin", AdminController.create);
routes.get("/admin", AdminController.index);
routes.put("/admin/:id", AdminController.update);
routes.get("/admin/:id", authentication.validate, AdminController.find);
routes.delete("/admin/:id", authentication.validate, AdminController.delete);

/* Equipe */
routes.post("/equipe", EquipeController.create);
routes.get("/equipe", EquipeController.index);
routes.put("/equipe/:id", EquipeController.update);
routes.get("/equipe/:id", EquipeController.find);
routes.delete("/equipe/:id", EquipeController.delete);

/* Candidato */
routes.post("/candidato", CandidatoController.create);
routes.post("/candidato/cv/:idconta", upload.single('pdf'), CandidatoController.sendCV)
routes.post("/candidato/areas/:idconta", CandidatoController.cadastrarAreas)
routes.get("/candidato", CandidatoController.index)
routes.get("/candidato/deletados", CandidatoController.indexAll)
routes.get("/candidato/:idconta", CandidatoController.findById)
routes.get("/candidato/social/:nome", CandidatoController.findByNomeSocial)
routes.get("/candidato/areas/:idconta", CandidatoController.findAreasByCandidatoId)
routes.put("/candidato/:idconta", CandidatoController.update)
routes.put("/candidato/interesses/:idconta", CandidatoController.atualizarInteresses)
routes.put("/candidato/areas/editar/:idconta", CandidatoController.atualizarAreasDeInteresse)
routes.delete("/candidato/:idconta", CandidatoController.delete)
// routes.put("/set-firebase-token/:id",candidatoController.setFirebaseToken);

/* Area */
routes.post("/area/create", AreaController.create);
routes.get("/area/find/:id", AreaController.findById);
routes.get("/area/list", AreaController.index);
routes.delete("/area/delete/:id", AreaController.delete);
routes.put("/area/update/:id", AreaController.update);

/* Tipo Servico */
routes.post("/tipo-servico/create", TipoServicoController.create);
routes.get("/tipo-servico/find/:id", TipoServicoController.findById);
routes.get("/tipo-servico/list", TipoServicoController.index);
routes.get("/tipo-servico/profissionais/:id", TipoServicoController.findProfissionais);
routes.delete("/tipo-servico/delete/:id", TipoServicoController.delete);
routes.put("/tipo-servico/update/:id", TipoServicoController.update);


// /* Profissional Liberal */
routes.post("/profissional-liberal/create",ProfissionalLiberalController.create);
routes.post("/profissional-liberal/sendimage/:idconta", upload.single('imagem'), ProfissionalLiberalController.sendImage);
routes.post("/profissional-liberal/tipo/:idconta", ProfissionalLiberalController.cadastroTipo);
routes.get("/profissional-liberal/index", ProfissionalLiberalController.index);
routes.get("/profissional-liberal/index-all", ProfissionalLiberalController.indexAll);
routes.get("/profissional-liberal/findById/:id", ProfissionalLiberalController.findById);
routes.get("/prossional-liberal-buscar-tipo/:idconta", ProfissionalLiberalController.findTipoByProfissionalId);
routes.put("/profissional-liberal/update/:id", ProfissionalLiberalController.update);
routes.delete("/profissional-liberal/delete/:id", ProfissionalLiberalController.delete);
// routes.get("/list-profissionais",profissionalLiberalController.index);
// routes.get("/list-all-profissionais",profissionalLiberalController.indexAll);
// routes.delete("/delete-profissional/:id", profissionalLiberalController.delete);
// routes.put("/update-profissional/:id",multer().single('file'), profissionalLiberalController.update);
// routes.get("/find-profissional/:id", profissionalLiberalController.findById);
// routes.get("/find-file/:id", profissionalLiberalController.getFile);
// routes.put("/reactivate-profissional/:id", profissionalLiberalController.reactivate);
// routes.put("/password-profissional/:id", profissionalLiberalController.updatePassword);

// /*Empresa */
routes.post("/empresa", EmpresaController.create);
routes.get("/empresa", EmpresaController.index);
routes.delete("/empresa/:id", EmpresaController.delete);
routes.put("/empresa/:id",EmpresaController.update);
routes.get("/empresa/:id",EmpresaController.findById);
routes.get("/empresa/representantes/:id", EmpresaController.getRepresentantesByEmpresaId)

/* Vaga */
routes.post("/vaga/", VagaController.create)
routes.post("/vaga/sendLogoAndBanner/:idvaga", upload.fields([{ name: 'logo' }, { name: 'banner' }]), VagaController.sendLogoAndBanner)
routes.get("/vaga", VagaController.index)
routes.get("/vaga/:idVaga", VagaController.findById)
routes.get("/vaga/conta/:id", VagaController.findByIdConta)
// routes.get("/vaga/matches/:id", VagaController.vagasMatch)
routes.put("/vaga/:idVaga", VagaController.update)
routes.delete("/vaga/:idVaga", VagaController.delete)
// routes.post("/create-vaga", multer().single('file'), vagaController.create);
// routes.get("/list-vagas-administrador", vagaController.indexAdministrador);
// routes.get("/list-vagas-candidato", vagaController.indexCandidato);
// routes.get("/list-vagas-candidato/:id", vagaController.indexForCandidato);
// routes.get("/list-vagas-equipe", vagaController.indexEquipe);
// routes.get("/list-vagas-empresa/:id", vagaController.indexEmpresa);
// routes.delete("/delete-vaga-adm/:id", vagaController.deleteByADM);
// routes.delete("/delete-vaga-equipe/:id", vagaController.deleteByEquipe);
// routes.delete("/delete-vaga-representante/:id", vagaController.deleteByRepresentante);
// routes.get("/find-vaga/:id",vagaController.findById);
// routes.put("/update-vaga", multer().single('file'), vagaController.update); 
// routes.post("/canditar-vaga",vagaController.candidatar);
// routes.put("/reactivate-vaga/:id", vagaController.reactivate);
// routes.get("/find-file-vaga/:id", vagaController.getFile);

// /* Representante */
routes.post("/representante", RepresentanteController.create);
routes.get("/representante",RepresentanteController.index);
routes.delete("/representante/:id", RepresentanteController.delete);
routes.put("/representante/:id", RepresentanteController.update);
routes.get("/representante/:id",RepresentanteController.findById);

// /* Cep */
// routes.post("/create-cep", cepController.create);
// routes.get("/find-cep/:cep", cepController.find);
// routes.get("/list-ceps", cepController.index);

routes.post("/enviarEmailComCurriculo/:idconta/:idvaga", upload.single('pdf'), CandidatoController.enviarEmailCurriculo)
routes.post("/enviarEmailComCurriculoDoPerfil/:idconta/:idvaga", CandidatoController.enviarEmailCurriculoDoPerfil)

export default routes;
