import {Component, OnInit} from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {RestaurantDetailsComponent} from "./details/restaurant-details.component";

export interface PaginatedRestaurant {
  id: number;
  name: string;
  averageRating: number;
  totalReviews: number;
  image: {
    filename: string,
    url: string
  };
}

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    RestaurantDetailsComponent
  ],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss'
})
export class RestaurantComponent implements OnInit {
  restaurants: PaginatedRestaurant[] = [];
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

  restaurantDialog: boolean[] = [];

  constructor(private readonly restaurantService: RestaurantService) {
  }

  ngOnInit(): void {
    this.findRestaurants();
  }

  closeDialog(restaurantId: number) {
    this.restaurantDialog[restaurantId] = false;
  }

  findRestaurants() {
    this.restaurantService.findAllPaginated(this.paginatedParams, this.filter).subscribe((paginatedRestaurant) => {
      this.restaurants = paginatedRestaurant.content;
      this.paginatedInfo = paginatedRestaurant.page;
      this.restaurantDialog = new Array(this.restaurants.length).fill(false);
    });
  }
}
