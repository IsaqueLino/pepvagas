import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProtecGuard } from './protec.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'recovery', loadChildren: () => import('./recovery/recovery.module').then(m => m.RecoveryPageModule) },

  /* Administrador */
  {
    path: 'cadastro-adm', loadChildren: () => import('./adm/pages/cadastro/cadastro.module').then(m => m.CadastroPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'listar-adm', loadChildren: () => import('./adm/pages/listar/listar.module').then(m => m.ListarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'visualizar-adm', loadChildren: () => import('./adm/pages/visualizar/visualizar.module').then(m => m.VisualizarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'alterar-adm', loadChildren: () => import('./adm/pages/alterar/alterar.module').then(m => m.AlterarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'perfil-adm', loadChildren: () => import('./adm/pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'perfil-adm-alterar', loadChildren: () => import('./adm/pages/perfil-alterar/perfil-alterar.module').then(m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },




  /* Area */
  {
    path: 'cadastro-area', loadChildren: () => import('./area/pages/cadastro/cadastro.module').then(m => m.CadastroPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'listar-areas', loadChildren: () => import('./area/pages/listar/listar.module').then(m => m.ListarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'alterar-area', loadChildren: () => import('./area/pages/alterar/alterar.module').then(m => m.AlterarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },


  /* Equipe */
  {
    path: 'alterar-equipe', loadChildren: () => import('./equipe/pages/alterar/alterar.module').then(m => m.AlterarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Equipe', 'Administrador'] }
  },
  {
    path: 'cadastro-equipe', loadChildren: () => import('./equipe/pages/cadastro/cadastro.module').then(m => m.CadastroPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Equipe', 'Administrador'] }
  },
  {
    path: 'visualizar-equipe', loadChildren: () => import('./equipe/pages/visualizar/visualizar.module').then(m => m.VisualizarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'listar-equipe', loadChildren: () => import('./equipe/pages/listar/listar.module').then(m => m.ListarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'perfil-equipe', loadChildren: () => import('./equipe/pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Equipe'] }
  },
  {
    path: 'perfil-equipe-alterar', loadChildren: () => import('./equipe/pages/perfil-alterar/perfil-alterar.module').then(m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Equipe'] }
  },    




  /* Candidato */
  {
    path: 'listar-candidato', loadChildren: () => import('./candidato/pages/listar/listar.module').then(m => m.ListarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'cadastro-candidato', loadChildren: () => import('./candidato/pages/cadastro/cadastro.module').then(m => m.CadastroPageModule),
  },
  {
    path: 'alterar-candidato', loadChildren: () => import('./candidato/pages/alterar/alterar.module').then(m => m.AlterarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Candidato', 'Administrador'] }
  },
  {
    path: 'perfil-candidato',
    loadChildren: () => import('./candidato/pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Candidato', 'Administrador'] }
  },
  {
    path: 'visualizar-candidato',
    loadChildren: () => import('./candidato/pages/visualizar/visualizar.module').then( m => m.VisualizarPageModule)
  },
  {
    path: 'new-password-candidato',
    loadChildren: () => import('./candidato/pages/new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },



  /* Empresa */
  {
    path: 'cadastro-empresa', loadChildren: () => import('./empresa/pages/cadastro/cadastro.module').then(m => m.CadastroPageModule),
  },
  {
    path: 'alterar-empresa', loadChildren: () => import('./empresa/pages/alterar/alterar.module').then(m => m.AlterarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Empresa', 'Administrador'] }
  },
  {
    path: 'listar-empresa', loadChildren: () => import('./empresa/pages/listar/listar.module').then(m => m.ListarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'visualizar-empresa', loadChildren: () => import('./empresa/pages/visualizar/visualizar.module').then(m => m.VisualizarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Empresa', 'Administrador'] }
  },
  {
    path: 'perfil-empresa',
    loadChildren: () => import('./empresa/pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Empresa'] }
  },

  /* Profissional Liberal */
  {
    path: 'cadastro-profissional', loadChildren: () => import('./profissional-liberal/pages/cadastro/cadastro.module').then(m => m.CadastroPageModule),
  },
  {
    path: 'listar-profissional', loadChildren: () => import('./profissional-liberal/pages/listar/listar.module').then(m => m.ListarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Administrador'] }
  },
  {
    path: 'alterar-profissional', loadChildren: () => import('./profissional-liberal/pages/alterar/alterar.module').then(m => m.AlterarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['ProfissionalLiberal', 'Administrador'] }
  },
  {
    path: 'perfil-profissional',
    loadChildren: () => import('./profissional-liberal/pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['ProfissionalLiberal', 'Administrador'] }
  },
  {
    path: 'home-profissional', loadChildren: () => import('./profissional-liberal/pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['ProfissionalLiberal'] }
  },
  {path: 'descricao', loadChildren: () => import('./profissional-liberal/pages/descricao/descricao.module').then(m => m.DescricaoPageModule)},
  {
    path: 'listar-servicos',
    loadChildren: () => import('./profissional-liberal/pages/lista-servicos/lista-servicos.module').then(m => m.ListaServicosPageModule)
  },
  {
    path: 'visualizar-profissional',
    loadChildren: () => import('./profissional-liberal/pages/visualizar/visualizar.module').then( m => m.VisualizarPageModule)
  },
  {
    path: 'new-password-profissional',
    loadChildren: () => import('./profissional-liberal/pages/new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },

  /*Representante*/
  {
    path: 'alterar-representante',
    loadChildren: () => import('./representante/pages/alterar/alterar.module').then( m => m.AlterarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Representante','Empresa','Administrador'] }
  },
  {
    path: 'cadastro-representante',
    loadChildren: () => import('./representante/pages/cadastro/cadastro.module').then( m => m.CadastroPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Empresa','Administrador'] }
  },
  {
    path: 'listar-representantes',
    loadChildren: () => import('./representante/pages/listar/listar.module').then( m => m.ListarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Empresa','Administrador'] }
  },
  {
    path: 'visualizar-representante',
    loadChildren: () => import('./representante/pages/visualizar/visualizar.module').then( m => m.VisualizarPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Representante','Empresa','Administrador'] }
  },
  {
    path: 'perfil-representante',
    loadChildren: () => import('./representante/pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Representante'] }
  },

  /* Vaga */
  {
    path: 'cadastro-vaga', loadChildren: () => import('./vaga/pages/cadastro-vaga/cadastro-vaga.module').then(m => m.CadastroVagaPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Equipe','Representante','Administrador'] }
  },
  {
    path: 'listar-vaga', loadChildren: () => import('./vaga/pages/listar-vaga/listar-vaga.module').then( m => m.ListarVagaPageModule)
  },
  {
    path: 'alterar-vaga', loadChildren: () => import('./vaga/pages/alterar-vaga/alterar-vaga.module').then( m => m.AlterarVagaPageModule),
    canActivate: [ProtecGuard], data: { allowedUserTypes: ['Equipe','Representante','Administrador'] }
  },
  {
    path: 'visualizar-vaga', loadChildren: () => import('./vaga/pages/visualizar-vaga/visualizar-vaga.module').then( m => m.VisualizarVagaPageModule)
  },
  {
    path: 'lista-candidatos', loadChildren: () => import('./vaga/pages/lista-candidatos/lista-candidatos.module').then( m => m.ListaCandidatosPageModule)
  },





  /*Cadastro Geral*/
  {
    path: 'cadastro-geral',
    loadChildren: () => import('./cadastro-geral/cadastro-geral.module').then( m => m.CadastroGeralPageModule)
  },












];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
