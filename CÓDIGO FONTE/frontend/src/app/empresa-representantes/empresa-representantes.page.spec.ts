import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresaRepresentantesPage } from './empresa-representantes.page';

describe('EmpresaRepresentantesPage', () => {
  let component: EmpresaRepresentantesPage;
  let fixture: ComponentFixture<EmpresaRepresentantesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaRepresentantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
