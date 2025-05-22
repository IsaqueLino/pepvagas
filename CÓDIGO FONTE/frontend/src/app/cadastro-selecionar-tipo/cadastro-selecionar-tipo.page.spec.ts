import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroSelecionarTipoPage } from './cadastro-selecionar-tipo.page';

describe('CadastroSelecionarTipoPage', () => {
  let component: CadastroSelecionarTipoPage;
  let fixture: ComponentFixture<CadastroSelecionarTipoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroSelecionarTipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
