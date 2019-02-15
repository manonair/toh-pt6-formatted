import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Reservation } from './reservation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const reservations = [
      { id: 11, name: 'Mr. Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    return {reservations: reservations};
  }

  // Overrides the genId method to ensure that a Reservation always has an id.
  // If the reservations array is empty,
  // the method below returns the initial number (11).
  // if the reservations array is not empty, the method below returns the highest
  // reservation id + 1.
  genId(reservations: Reservation[]): number {
    return reservations.length > 0 ? Math.max(...reservations.map(reservation => reservation.id)) + 1 : 11;
  }
}
