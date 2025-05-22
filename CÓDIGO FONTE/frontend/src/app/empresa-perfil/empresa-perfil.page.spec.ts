import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresaPerfilPage } from './empresa-perfil.page';

describe('EmpresaPerfilPage', () => {
  let component: EmpresaPerfilPage;
  let fixture: ComponentFixture<EmpresaPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
