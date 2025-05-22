import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhasVagasPage } from './minhas-vagas.page';

describe('MinhasVagasPage', () => {
  let component: MinhasVagasPage;
  let fixture: ComponentFixture<MinhasVagasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhasVagasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
