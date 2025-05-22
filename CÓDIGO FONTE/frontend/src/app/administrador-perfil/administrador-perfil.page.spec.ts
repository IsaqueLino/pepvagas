import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorPerfilPage } from './administrador-perfil.page';

describe('AdministradorPerfilPage', () => {
  let component: AdministradorPerfilPage;
  let fixture: ComponentFixture<AdministradorPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
