import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarAreaPage } from './listar-area.page';

describe('ListarAreaPage', () => {
  let component: ListarAreaPage;
  let fixture: ComponentFixture<ListarAreaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
