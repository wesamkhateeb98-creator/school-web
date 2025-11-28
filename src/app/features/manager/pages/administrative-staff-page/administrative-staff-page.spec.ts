import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeStaffPage } from './administrative-staff-page';

describe('AdministrativeStaffPage', () => {
  let component: AdministrativeStaffPage;
  let fixture: ComponentFixture<AdministrativeStaffPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrativeStaffPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrativeStaffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
