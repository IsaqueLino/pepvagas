import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatoPerfilPage } from './candidato-perfil.page';

describe('CandidatoPerfilPage', () => {
  let component: CandidatoPerfilPage;
  let fixture: ComponentFixture<CandidatoPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatoPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
