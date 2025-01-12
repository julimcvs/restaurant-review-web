import {Component, OnInit} from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";

export interface RestaurantePaginado {
  id: number;
  name: string;
  averageRating: number;
  totalReviews: number;
}

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule
  ],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss'
})
export class RestaurantComponent implements OnInit {
  restaurants: RestaurantePaginado[] = [];
  paginatedParams = {
    page: 0,
    size: 12,
    sort: 'id',
    direction: 'desc',
  };
  filter = {};

  paginatedInfo = {
    size: 12,
    number: 0,
    totalElements: 0,
    totalPages: 0
  }

  constructor(private readonly restaurantService: RestaurantService) {
  }

  ngOnInit(): void {
    this.restaurantService.findAllPaginated(this.paginatedParams, this.filter).subscribe((paginatedRestaurant) => {
      this.restaurants = paginatedRestaurant.content;
      this.paginatedInfo = paginatedRestaurant.page;
    });
  }
}
