import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterarPage } from './alterar.page';

describe('AlterarPage', () => {
  let component: AlterarPage;
  let fixture: ComponentFixture<AlterarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AlterarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
