import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipePerfilPage } from './equipe-perfil.page';

describe('EquipePerfilPage', () => {
  let component: EquipePerfilPage;
  let fixture: ComponentFixture<EquipePerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipePerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
