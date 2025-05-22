import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizarVagaPage } from './visualizar-vaga.page';

describe('VisualizarVagaPage', () => {
  let component: VisualizarVagaPage;
  let fixture: ComponentFixture<VisualizarVagaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizarVagaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
