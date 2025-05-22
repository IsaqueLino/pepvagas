import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaAdministradorPage } from './tela-administrador.page';

describe('TelaAdministradorPage', () => {
  let component: TelaAdministradorPage;
  let fixture: ComponentFixture<TelaAdministradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaAdministradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
