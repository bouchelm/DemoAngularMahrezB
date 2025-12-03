import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAcceuil } from './page-acceuil';

describe('PageAcceuil', () => {
  let component: PageAcceuil;
  let fixture: ComponentFixture<PageAcceuil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAcceuil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAcceuil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
