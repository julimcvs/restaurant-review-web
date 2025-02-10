import {Injectable} from '@angular/core';
import {ApiService, Page} from "./api.service";
import {HttpParams} from "@angular/common/http";
import {PaginatedRestaurant} from "../pages/restaurant/restaurant.component";

export interface RestaurantDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  address: Address;
  images: Image[];
}

interface Image {
  filename: string;
  url: string;
}

interface Address {
  street: string;
  city: string;
  neighborhood: string;
  number: string;
  country: string;
  state: string;
  zipCode: string;
}

export interface RestaurantSettings {
  availableDates: string[];
  tableSettings: number[];
}

export interface Vacancy {
  id: number;
  startTime: string;
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
    const httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('size', String(params.size))
      .set('sort', params.sort)
      .set('direction', params.direction);
    return this.apiService.post<Page<PaginatedRestaurant>>(`${this.endpoint}/paginated`, filter, httpParams);
  }

  findById(id: number) {
    return this.apiService.get<RestaurantDetails>(`${this.endpoint}/${id}`);
  }

  findSettingsById(id: number) {
    return this.apiService.get<RestaurantSettings>(`${this.endpoint}/${id}/settings`);
  }

  findVacanciesById(id: number, params: {
    tableFor: number,
    date: string,
  }) {
    const httpParams = new HttpParams()
      .set('tableFor', String(params.tableFor))
      .set('date', params.date);
    return this.apiService.get<Vacancy[]>(`${this.endpoint}/${id}/vacancies`, httpParams);
  }

  save(input: FormData) {
    return this.apiService.post(`${this.endpoint}`, input);
  }
}
