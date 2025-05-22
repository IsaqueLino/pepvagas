import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroEmpresaPage } from './cadastro-empresa.page';

describe('CadastroEmpresaPage', () => {
  let component: CadastroEmpresaPage;
  let fixture: ComponentFixture<CadastroEmpresaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
