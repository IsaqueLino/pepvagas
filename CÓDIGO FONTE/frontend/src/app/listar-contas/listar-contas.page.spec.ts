import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarContasPage } from './listar-contas.page';

describe('ListarContasPage', () => {
  let component: ListarContasPage;
  let fixture: ComponentFixture<ListarContasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarContasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
