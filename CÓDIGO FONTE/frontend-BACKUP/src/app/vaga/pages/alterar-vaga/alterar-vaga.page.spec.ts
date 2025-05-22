import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterarVagaPage } from './alterar-vaga.page';

describe('AlterarVagaPage', () => {
  let component: AlterarVagaPage;
  let fixture: ComponentFixture<AlterarVagaPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(AlterarVagaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
