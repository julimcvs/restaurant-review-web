import {Injectable} from '@angular/core';
import {ApiService, Page} from "./api.service";
import {HttpParams} from "@angular/common/http";
import {RestaurantePaginado} from "../pages/restaurant/restaurant.component";

interface SaveRestaurantDto {
  id?: number;
  name: string | null;
  description: string | null;
  categoryId: number | null;
  address: Partial<{
    street: string | null;
    city: string | null;
    neighborhood: string | null;
    number: string | null;
    country: string | null;
    state: string | null;
    zipCode: string | null;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly endpoint = 'restaurants';

  constructor(private readonly apiService: ApiService) {
  }

  findAllPaginated(
    params: {
      page: number,
      size: number,
      sort: string,
      direction: string
    },
    filter: any
  ) {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('size', String(params.size))
      .set('sort', params.sort)
      .set('direction', params.direction);
    return this.apiService.post<Page<RestaurantePaginado>>(`${this.endpoint}/paginated`, filter, httpParams);
  }

  save(input: FormData) {
    return this.apiService.post(`${this.endpoint}`, input);
  }
}
