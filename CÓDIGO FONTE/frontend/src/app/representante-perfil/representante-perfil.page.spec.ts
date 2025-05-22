import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentantePerfilPage } from './representante-perfil.page';

describe('RepresentantePerfilPage', () => {
  let component: RepresentantePerfilPage;
  let fixture: ComponentFixture<RepresentantePerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentantePerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
