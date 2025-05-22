import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarContaPage } from './recuperar-conta.page';

describe('RecuperarContaPage', () => {
  let component: RecuperarContaPage;
  let fixture: ComponentFixture<RecuperarContaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarContaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
