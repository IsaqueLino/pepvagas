import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarVagaPage } from './editar-vaga.page';

describe('EditarVagaPage', () => {
  let component: EditarVagaPage;
  let fixture: ComponentFixture<EditarVagaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarVagaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
