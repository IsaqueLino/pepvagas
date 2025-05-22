import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroTipoServicoPage } from './cadastro-tipo-servico.page';

describe('CadastroTipoServicoPage', () => {
  let component: CadastroTipoServicoPage;
  let fixture: ComponentFixture<CadastroTipoServicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroTipoServicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
