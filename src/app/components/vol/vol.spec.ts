import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol } from './vol';

describe('Vol', () => {
  let component: Vol;
  let fixture: ComponentFixture<Vol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
