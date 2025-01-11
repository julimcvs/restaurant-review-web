import {Injectable} from '@angular/core';
import {ApiService, Page} from "./api.service";
import {HttpParams} from "@angular/common/http";
import {RestaurantePaginado} from "../pages/restaurant/restaurant.component";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly endpoint = 'restaurants';

  constructor(private readonly apiService: ApiService) { }

  findAllPaginated(
    params: {
      page: number,
      size: number,
      sort: string,
      direction: string
    },
    filter: any
  ) {
    const httpParams = new HttpParams();
    httpParams.set('page', String(params.page))
    httpParams.set('size', String(params.size))
    httpParams.set('sort', params.sort)
    httpParams.set('direction', params.direction)
    return this.apiService.post<Page<RestaurantePaginado>>(`${this.endpoint}/paginated`, filter, httpParams);
  }
}
