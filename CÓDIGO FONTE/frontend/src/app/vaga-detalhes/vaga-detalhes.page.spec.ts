import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VagaDetalhesPage } from './vaga-detalhes.page';

describe('VagaDetalhesPage', () => {
  let component: VagaDetalhesPage;
  let fixture: ComponentFixture<VagaDetalhesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VagaDetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
