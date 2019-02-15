import { Component, OnInit } from '@angular/core';

import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Reservation[];

  constructor(private heroService: ReservationService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getReservations()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addReservation({ name } as Reservation)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Reservation): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteReservation(hero).subscribe();
  }

}
