import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroEquipePage } from './cadastro-equipe.page';

describe('CadastroEquipePage', () => {
  let component: CadastroEquipePage;
  let fixture: ComponentFixture<CadastroEquipePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroEquipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
