import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ReservationSearchComponent as ReservationSearchComponent } from '../reservation-search/reservation-search.component';

import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RESERVATIONS } from '../mock-reservation';
import { ReservationService } from '../reservation.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let reservationService;
  let getReservationsSpy;

  beforeEach(async(() => {
    reservationService = jasmine.createSpyObj('ReservationService', ['getReservations']);
    getReservationsSpy = reservationService.getReservations.and.returnValue( of(RESERVATIONS) );
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        ReservationSearchComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ReservationService, useValue: reservationService }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Reservations" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Top Reservations');
  });

  it('should call reservationService', async(() => {
    expect(getReservationsSpy.calls.any()).toBe(true);
    }));

  it('should display 4 links', async(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
  }));

});
