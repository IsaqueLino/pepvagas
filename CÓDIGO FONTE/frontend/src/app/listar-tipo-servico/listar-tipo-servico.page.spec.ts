import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarTipoServicoPage } from './listar-tipo-servico.page';

describe('ListarTipoServicoPage', () => {
  let component: ListarTipoServicoPage;
  let fixture: ComponentFixture<ListarTipoServicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarTipoServicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
