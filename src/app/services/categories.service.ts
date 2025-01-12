import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";

export interface CategoryList {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly endpoint = 'categories';

  constructor(private readonly apiService: ApiService) { }

  findAll() {
    return this.apiService.get<CategoryList[]>(`${this.endpoint}`);
  }
}
