import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfissionalDetalhesPage } from './profissional-detalhes.page';

describe('ProfissionalDetalhesPage', () => {
  let component: ProfissionalDetalhesPage;
  let fixture: ComponentFixture<ProfissionalDetalhesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalDetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
