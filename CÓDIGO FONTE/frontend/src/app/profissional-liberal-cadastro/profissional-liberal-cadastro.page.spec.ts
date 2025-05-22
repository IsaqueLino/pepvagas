import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfissionalLiberalCadastroPage } from './profissional-liberal-cadastro.page';

describe('ProfissionalLiberalCadastroPage', () => {
  let component: ProfissionalLiberalCadastroPage;
  let fixture: ComponentFixture<ProfissionalLiberalCadastroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalLiberalCadastroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
