import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avion } from './avion';

describe('Avion', () => {
  let component: Avion;
  let fixture: ComponentFixture<Avion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
