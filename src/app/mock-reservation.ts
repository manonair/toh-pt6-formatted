import { Reservation } from './reservation';

export const RESERVATIONS: Reservation[] = [
  { tableReservationId: 1, name: 'Mr. Nice', tableId:1,tableType:'TABLE4',tableDesc:'4 SEATER',capacity:4,status:'A', bookingStart:'any',bookingEnd:'any' , restaurantId:1,restaurantName:'DUREY',bookingId:'1-1-1-1',userId:1 },
  { tableReservationId: 2, name: 'Mr. Nice', tableId:2,tableType:'TABLE6',tableDesc:'6 SEATER',capacity:6,status:'A',bookingStart:'any',bookingEnd:'any' ,restaurantId:1,restaurantName:'DUREY',bookingId:'1-2-1-1',userId:2 },
  { tableReservationId: 3, name: 'Mr. Nice', tableId:3,tableType:'TABLE8',tableDesc:'8 SEATER',capacity:8,status:'A',bookingStart:'any',bookingEnd:'any' ,restaurantId:1,restaurantName:'DUREY',bookingId:'1-3-1-1',userId:3 }
];
