import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroCandidatoPage } from './cadastro-candidato.page';

describe('CadastroCandidatoPage', () => {
  let component: CadastroCandidatoPage;
  let fixture: ComponentFixture<CadastroCandidatoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroCandidatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
