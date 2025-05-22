import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarVagaPage } from './listar-vaga.page';

describe('ListarVagaPage', () => {
  let component: ListarVagaPage;
  let fixture: ComponentFixture<ListarVagaPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(ListarVagaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
