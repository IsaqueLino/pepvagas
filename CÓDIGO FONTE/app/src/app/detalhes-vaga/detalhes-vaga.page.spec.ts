import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesVaga } from './detalhes-vaga.page';

describe('DetalhesVaga', () => {
  let component: DetalhesVaga;
  let fixture: ComponentFixture<DetalhesVaga>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesVaga);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
