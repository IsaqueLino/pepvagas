import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilAlterarPage } from './perfil-alterar.page';

describe('PerfilAlterarPage', () => {
  let component: PerfilAlterarPage;
  let fixture: ComponentFixture<PerfilAlterarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilAlterarPage],
    }).compileComponents();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
