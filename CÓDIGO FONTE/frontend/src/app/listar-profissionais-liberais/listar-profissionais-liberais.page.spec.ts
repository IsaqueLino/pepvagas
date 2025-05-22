import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProfissionaisLiberaisPage } from './listar-profissionais-liberais.page';

describe('ListarProfissionaisLiberaisPage', () => {
  let component: ListarProfissionaisLiberaisPage;
  let fixture: ComponentFixture<ListarProfissionaisLiberaisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProfissionaisLiberaisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
