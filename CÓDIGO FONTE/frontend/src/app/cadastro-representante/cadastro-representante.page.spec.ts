import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroRepresentantePage } from './cadastro-representante.page';

describe('CadastroRepresentantePage', () => {
  let component: CadastroRepresentantePage;
  let fixture: ComponentFixture<CadastroRepresentantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroRepresentantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
