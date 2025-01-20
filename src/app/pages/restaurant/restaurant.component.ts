import {Component, OnInit} from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {RestaurantDetailsComponent} from "./details/restaurant-details.component";
import {finalize} from "rxjs";
import {PaginatorState} from "primeng/paginator";

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
  loading = false;
  paginatedParams = {
    page: 0,
    size: 12,
    sort: 'id',
    direction: 'desc',
  };
  filter = {};
  first = 12;
  paginatedInfo = {
    size: 12,
    number: 0,
    totalElements: 0,
    totalPages: 0
  }
  restaurants: PaginatedRestaurant[] = [];
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
    this.loading = true;
    this.restaurantService.findAllPaginated(this.paginatedParams, this.filter)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
      next: (paginatedRestaurant) => {
        this.restaurants = paginatedRestaurant.content;
        this.paginatedInfo = paginatedRestaurant.page;
        this.restaurantDialog = new Array(this.restaurants.length).fill(false);
      },
    });
  }

  onPageChange(event: PaginatorState) {
    this.first = (<number>event.first);
    this.paginatedParams.page = (<number>event.first) / (<number>event.rows);
    this.paginatedParams.size = (<number>event.rows)
    this.findRestaurants();
  }
}
