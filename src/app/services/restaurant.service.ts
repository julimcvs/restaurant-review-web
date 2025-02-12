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

export interface Vacancy {
  id: number;
  startTime: string;
}

export interface RestaurantConfiguration {
  vacancyInterval: number;
  schedules: RestaurantSchedule[];
  tableSettings: TableSetting[];
}

export interface RestaurantConfigurationForm {
  vacancyInterval?: number | null;
  schedules?: RestaurantScheduleForm[] | null;
  tableSettings?: TableSettingForm[] | null
}

export interface TableSettingForm {
  tableFor?: number | null;
  vacancyAmount?: number | null;
}

export interface TableSetting {
  tableFor: number;
  vacancyAmount: number;
}

export interface RestaurantScheduleForm {
  dayOfWeek?: number | string | null;
  openingTime?: string | null;
  closingTime?: string | null;
}

export interface RestaurantSchedule {
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
}

interface FindVacancies {
  vacancies: string[];
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

  findVacanciesById(
    params: {
      tableFor: number,
      date: string,
    },
    restaurantId: number
  ) {
    const httpParams = new HttpParams()
      .set('tableFor', String(params.tableFor))
      .set('date', params.date)
    return this.apiService.get<FindVacancies>(`${this.endpoint}/${restaurantId}/vacancies`, httpParams);
  }

  findById(id: number) {
    return this.apiService.get<RestaurantDetails>(`${this.endpoint}/${id}`);
  }

  findConfigurationById(id: number) {
    return this.apiService.get<RestaurantConfiguration>(`${this.endpoint}/${id}/configuration`);
  }

  save(input: FormData) {
    return this.apiService.post(`${this.endpoint}`, input);
  }

  updateConfiguration(id: number, input: RestaurantConfigurationForm) {
    return this.apiService.put<void>(`${this.endpoint}/${id}/configuration`, input);
  }
}
