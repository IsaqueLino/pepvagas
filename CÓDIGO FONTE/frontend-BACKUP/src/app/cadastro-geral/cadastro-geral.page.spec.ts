import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroGeralPage } from './cadastro-geral.page';

describe('CadastroGeralPage', () => {
  let component: CadastroGeralPage;
  let fixture: ComponentFixture<CadastroGeralPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CadastroGeralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
