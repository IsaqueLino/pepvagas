import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroAreaPage } from './cadastro-area.page';

describe('CadastroAreaPage', () => {
  let component: CadastroAreaPage;
  let fixture: ComponentFixture<CadastroAreaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
