import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'criar-conta',
    loadChildren: () => import('./criar-conta/criar-conta.module').then(m => m.CriarContaPageModule)
  },
  {
    path: 'cadastro-candidato',
    loadChildren: () => import('./cadastro-candidato/cadastro-candidato.module').then(m => m.CadastroCandidatoPageModule)
  },
  {
    path: 'profissional-liberal-cadastro',
    loadChildren: () => import('./profissional-liberal-cadastro/profissional-liberal-cadastro.module').then(m => m.ProfissionalLiberalCadastroPageModule)
  },
  {
    path: 'cadastro-area',
    loadChildren: () => import('./cadastro-area/cadastro-area.module').then(m => m.CadastroAreaPageModule)
  },
  {
    path: 'cadastro-tipo-servico',
    loadChildren: () => import('./cadastro-tipo-servico/cadastro-tipo-servico.module').then(m => m.CadastroTipoServicoPageModule)
  },
  {
    path: 'candidato-perfil',
    loadChildren: () => import('./candidato-perfil/candidato-perfil.module').then(m => m.CandidatoPerfilPageModule)
  },
  {
    path: 'cadastro-equipe',
    loadChildren: () => import('./cadastro-equipe/cadastro-equipe.module').then(m => m.CadastroEquipePageModule)
  },
  {
    path: 'cadastro-selecionar-tipo',
    loadChildren: () => import('./cadastro-selecionar-tipo/cadastro-selecionar-tipo.module').then(m => m.CadastroSelecionarTipoPageModule)
  },
  {
    path: 'vaga-detalhes',
    loadChildren: () => import('./vaga-detalhes/vaga-detalhes.module').then(m => m.VagaDetalhesPageModule)
  },
  {
    path: 'cadastro-vaga',
    loadChildren: () => import('./cadastro-vaga/cadastro-vaga.module').then(m => m.CadastroVagaPageModule)

  },
  {
    path: 'perfil-profissional-liberal',
    loadChildren: () => import('./perfil-profissional-liberal/perfil-profissional-liberal.module').then(m => m.PerfilProfissionalLiberalPageModule)
  },
  {
    path: 'cadastro-empresa',
    loadChildren: () => import('./cadastro-empresa/cadastro-empresa.module').then(m => m.CadastroEmpresaPageModule)
  },
  {
    path: 'cadastro-representante',
    loadChildren: () => import('./cadastro-representante/cadastro-representante.module').then(m => m.CadastroRepresentantePageModule)
  },
  {
    path: 'tela-administrador',
    loadChildren: () => import('./tela-administrador/tela-administrador.module').then(m => m.TelaAdministradorPageModule)
  },
  {
    path: 'representante-perfil',
    loadChildren: () => import('./representante-perfil/representante-perfil.module').then(m => m.RepresentantePerfilPageModule)
  },
  {
    path: 'equipe-perfil',
    loadChildren: () => import('./equipe-perfil/equipe-perfil.module').then(m => m.EquipePerfilPageModule)
  },
  {
    path: 'empresa-perfil',
    loadChildren: () => import('./empresa-perfil/empresa-perfil.module').then(m => m.EmpresaPerfilPageModule)
  },
  {
    path: 'minhas-vagas',
    loadChildren: () => import('./minhas-vagas/minhas-vagas.module').then(m => m.MinhasVagasPageModule)
  },
  {
    path: 'listar-area',
    loadChildren: () => import('./listar-area/listar-area.module').then(m => m.ListarAreaPageModule)
  },
  {
    path: 'listar-tipo-servico',
    loadChildren: () => import('./listar-tipo-servico/listar-tipo-servico.module').then(m => m.ListarTipoServicoPageModule)
  },
  {
    path: 'listar-contas',
    loadChildren: () => import('./listar-contas/listar-contas.module').then(m => m.ListarContasPageModule)
  },
  {
    path: 'cadastro-administrador',
    loadChildren: () => import('./cadastro-administrador/cadastro-administrador.module').then(m => m.CadastroAdministradorPageModule)
  },
  {
    path: 'empresa-representantes',
    loadChildren: () => import('./empresa-representantes/empresa-representantes.module').then(m => m.EmpresaRepresentantesPageModule)
  },
  {
    path: 'editar-vaga',
    loadChildren: () => import('./editar-vaga/editar-vaga.module').then(m => m.EditarVagaPageModule)
  },
  {
    path: 'listar-profissionais-liberais',
    loadChildren: () => import('./listar-profissionais-liberais/listar-profissionais-liberais.module').then(m => m.ListarProfissionaisLiberaisPageModule)
  },
  {
    path: 'profissional-detalhes',
    loadChildren: () => import('./profissional-detalhes/profissional-detalhes.module').then(m => m.ProfissionalDetalhesPageModule)
  },
  {
    path: 'tela-profissionais-liberais',
    loadChildren: () => import('./tela-profissionais-liberais/tela-profissionais-liberais.module').then(m => m.TelaProfissionaisLiberaisPageModule)
  },
  {
    path: 'administrador-perfil',
    loadChildren: () => import('./administrador-perfil/administrador-perfil.module').then(m => m.AdministradorPerfilPageModule)
  },
  {
    path: 'recuperar-conta',
    loadChildren: () => import('./recuperar-conta/recuperar-conta.module').then(m => m.RecuperarContaPageModule)
  },
  {
    path: 'vagas-candidatas',
    loadChildren: () => import('./vagas-candidatas/vagas-candidatas.module').then(m => m.VagasCandidatasPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
