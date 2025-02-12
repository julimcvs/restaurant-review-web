import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";

export interface SaveReservation {
   restaurantId: number;
   tableFor: number;
   scheduledDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly endpoint = 'reservations';

  constructor(private readonly apiService: ApiService) {
  }

  save(input: SaveReservation) {
    return this.apiService.post(`${this.endpoint}`, input);
  }
}
