import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Reservation } from './reservation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const reservations = [
      { tableReservationId: 1, name: 'Mr. Nice', tableId:1,tableType:'TABLE4',tableDesc:'4 SEATER',capacity:4,status:'A', bookingStart:'any',bookingEnd:'any' , restaurantId:1,restaurantName:'DUREY',bookingId:'1-1-1-1',userId:1 },
      { tableReservationId: 2, name: 'Mr. Manoj', tableId:2,tableType:'TABLE6',tableDesc:'6 SEATER',capacity:6,status:'A',bookingStart:'any',bookingEnd:'any' ,restaurantId:1,restaurantName:'DUREY',bookingId:'1-2-1-1',userId:2 },
      { tableReservationId: 3, name: 'Mr. NAir', tableId:3,tableType:'TABLE8',tableDesc:'8 SEATER',capacity:8,status:'A',bookingStart:'any',bookingEnd:'any' ,restaurantId:1,restaurantName:'DUREY',bookingId:'1-3-1-1',userId:3 }
    ];
    return {reservations: reservations};
  }

  // Overrides the genId method to ensure that a Reservation always has an id.
  // If the reservations array is empty,
  // the method below returns the initial number (11).
  // if the reservations array is not empty, the method below returns the highest
  // reservation id + 1.
  genId(reservations: Reservation[]): number {
    return reservations.length > 0 ? Math.max(...reservations.map(reservation => reservation.tableReservationId)) + 1 : 11;
  }
}
