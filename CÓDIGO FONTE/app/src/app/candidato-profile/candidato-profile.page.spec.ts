import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatoProfilePage } from './candidato-profile.page';

describe('CandidatoProfilePage', () => {
  let component: CandidatoProfilePage;
  let fixture: ComponentFixture<CandidatoProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatoProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
