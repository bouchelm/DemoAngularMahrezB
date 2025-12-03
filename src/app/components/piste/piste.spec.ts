import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Piste } from './piste';

describe('Piste', () => {
  let component: Piste;
  let fixture: ComponentFixture<Piste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Piste]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Piste);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
