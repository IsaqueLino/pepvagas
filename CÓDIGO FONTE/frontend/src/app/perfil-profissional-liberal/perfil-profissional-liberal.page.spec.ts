import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilProfissionalLiberalPage } from './perfil-profissional-liberal.page';

describe('PerfilProfissionalLiberalPage', () => {
  let component: PerfilProfissionalLiberalPage;
  let fixture: ComponentFixture<PerfilProfissionalLiberalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilProfissionalLiberalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
