import {Injectable} from '@angular/core';
import {ApiService, Page} from "./api.service";
import {HttpParams} from "@angular/common/http";
import {IPaginatedParams} from "../shared/model/interface/paginated-params.interface";

interface CreateRating {
  rating: number;
  message: string;
  restaurantId: number;
}

export interface Review {
  id: number;
  message: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly endpoint = 'reviews';

  constructor(private readonly apiService: ApiService) {
  }

  findByRestaurantIdPaginated(restaurantId: number, params: IPaginatedParams) {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('size', String(params.size))
      .set('sort', params.sort)
      .set('direction', params.direction);
    return this.apiService.post<Page<Review>>(`${this.endpoint}/restaurant/${restaurantId}/paginated`, {},  httpParams);
  }

  save(input: CreateRating) {
    return this.apiService.post(`${this.endpoint}`, input);
  }
}
