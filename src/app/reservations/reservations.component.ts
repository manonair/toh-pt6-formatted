import { Component, OnInit } from '@angular/core';

import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  heroes: Reservation[];

  constructor(private reservationService: ReservationService) { }

  ngOnInit() {
    this.getReservations();
  }

  getReservations(): void {
    this.reservationService.getReservations()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.reservationService.addReservation({ name } as Reservation)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Reservation): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.reservationService.deleteReservation(hero).subscribe();
  }

}
