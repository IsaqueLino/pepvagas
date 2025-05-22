import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cadastro-candidato',
    loadChildren: () => import('./cadastro-candidato/cadastro-candidato.module').then( m => m.CadastroCandidatoPageModule)
  },
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
    },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'account-recovery',
    loadChildren: () => import('./account-recovery/account-recovery.module').then( m => m.AccountRecoveryPageModule)
  },
  {
    path: 'candidato-profile',
    loadChildren: () => import('./candidato-profile/candidato-profile.module').then( m => m.CandidatoProfilePageModule)
  },
  {
    path: 'detalhes-vaga',
    loadChildren: () => import('./detalhes-vaga/detalhes-vaga.module').then( m => m.DetalhesVagaModule)
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
export class AppRoutingModule {}
