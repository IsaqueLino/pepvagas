import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaServicosPage } from './lista-servicos.page';

describe('ListaServicosPage', () => {
  let component: ListaServicosPage;
  let fixture: ComponentFixture<ListaServicosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaServicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
