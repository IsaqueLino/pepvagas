import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VagasCandidatasPage } from './vagas-candidatas.page';

describe('VagasCandidatasPage', () => {
  let component: VagasCandidatasPage;
  let fixture: ComponentFixture<VagasCandidatasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VagasCandidatasPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VagasCandidatasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
