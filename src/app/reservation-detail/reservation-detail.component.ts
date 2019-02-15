import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Reservation }         from '../reservation';
import { ReservationService }  from '../reservation.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: [ './reservation-detail.component.css' ]
})
export class ReservationDetailComponent implements OnInit {
  @Input() reservation: Reservation;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getReservation();
  }

  getReservation(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.reservationService.getReservation(id)
      .subscribe(reservation => this.reservation = reservation);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.reservationService.updateReservation(this.reservation)
      .subscribe(() => this.goBack());
  }
}
