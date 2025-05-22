import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaCandidatosPage } from './lista-candidatos.page';

describe('ListaCandidatosPage', () => {
  let component: ListaCandidatosPage;
  let fixture: ComponentFixture<ListaCandidatosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaCandidatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
