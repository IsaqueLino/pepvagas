import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaProfissionaisLiberaisPage } from './tela-profissionais-liberais.page';

describe('TelaProfissionaisLiberaisPage', () => {
  let component: TelaProfissionaisLiberaisPage;
  let fixture: ComponentFixture<TelaProfissionaisLiberaisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaProfissionaisLiberaisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
