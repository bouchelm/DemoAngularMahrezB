import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hangar } from './hangar';

describe('Hangar', () => {
  let component: Hangar;
  let fixture: ComponentFixture<Hangar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hangar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hangar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
