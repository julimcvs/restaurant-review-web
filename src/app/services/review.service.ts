import {Injectable} from '@angular/core';
import {ApiService, Page} from "./api.service";
import {HttpParams} from "@angular/common/http";
import {PaginatedRestaurant} from "../pages/restaurant/restaurant.component";

interface CreateRating {
  rating: number;
  message: string;
  restaurantId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly endpoint = 'reviews';

  constructor(private readonly apiService: ApiService) {
  }

  save(input: CreateRating) {
    return this.apiService.post(`${this.endpoint}`, input);
  }
}
