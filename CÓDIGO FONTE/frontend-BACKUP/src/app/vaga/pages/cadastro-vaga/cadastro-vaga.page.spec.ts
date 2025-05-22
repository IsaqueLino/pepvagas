import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroVagaPage } from './cadastro-vaga.page';

describe('CadastroVagaPage', () => {
  let component: CadastroVagaPage;
  let fixture: ComponentFixture<CadastroVagaPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(CadastroVagaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
