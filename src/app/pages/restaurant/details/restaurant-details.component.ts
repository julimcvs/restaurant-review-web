import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {RestaurantDetails, RestaurantService} from "../../../services/restaurant.service";
import {MessageService, SelectItem} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Review, ReviewService} from "../../../services/review.service";
import {finalize} from "rxjs";
import {PageEvent} from "../../../shared/model/interface/page-event.interface";
import {PaginatorState} from "primeng/paginator";
import {DropdownChangeEvent} from "primeng/dropdown";

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.scss'
})
export class RestaurantDetailsComponent implements OnInit {
  @Input() restaurantId!: number;
  @Output('closeDialog') closeEvent = new EventEmitter<number>();
  form!: FormGroup;
  hasRating = false;
  images: {
    itemImageSrc: string,
    thumbnailImageSrc: string,
    alt: string,
    title: string,
  }[] = [];
  first = 0;
  loadingRestaurant = false;
  loadingReviews = false;
  loadingRating = false;
  paginatedParams = {
    page: 0,
    size: 5,
    sort: 'rating',
    direction: 'desc',
  };
  paginatedInfo = {
    size: 5,
    number: 0,
    totalElements: 0,
    totalPages: 0
  }
  rateDialog = false;
  reviews: Review[] = [];
  restaurant!: RestaurantDetails;
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  sortOptions: SelectItem[] = [
    {label: 'Rating High to Low', value: '!rating'},
    {label: 'Rating Low to High', value: 'rating'}
  ];
  sortOrder!: number;
  sortField!: string;

  constructor(private readonly restaurantService: RestaurantService,
              private readonly messageService: MessageService,
              private readonly reviewService: ReviewService,
              private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.findRestaurantById();
    this.form = this.formBuilder.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      message: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      restaurantId: [this.restaurantId, Validators.required],
    });
  }

  findRestaurantById() {
    this.loadingRestaurant = true;
    this.restaurantService.findById(this.restaurantId)
      .pipe(
        finalize(() => this.loadingRestaurant = false)
      ).subscribe({
      next: (restaurant) => {
        this.restaurant = restaurant;
        this.images = restaurant.images.map(image => ({
          itemImageSrc: image.url,
          thumbnailImageSrc: image.url,
          alt: image.filename,
          title: image.filename,
        }));
        this.findReviewsByRestaurantId();
      },
    });
  }

  findReviewsByRestaurantId() {
    this.loadingReviews = true;
    this.reviewService.findByRestaurantIdPaginated(this.restaurantId, this.paginatedParams)
      .pipe(
        finalize(() => this.loadingReviews = false)
      )
      .subscribe({
        next: (paginatedReviews) => {
          this.reviews = paginatedReviews.content;
          this.paginatedInfo = paginatedReviews.page;
        }
      });
  }

  onPageChange(event: PaginatorState) {
    this.first = (<number>event.first);
    this.paginatedParams.page = (<number>event.first) / (<number>event.rows);
    this.paginatedParams.size = (<number>event.rows)
    this.findReviewsByRestaurantId();
  }

  onSortChange(event: DropdownChangeEvent) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.paginatedParams.direction = 'DESC';
      this.paginatedParams.sort = value.substring(1, value.length);
    } else {
      this.paginatedParams.direction = 'ASC';
      this.paginatedParams.sort = value;
    }
    this.findReviewsByRestaurantId();
  }

  saveRating() {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, fill all required fields',
        life: 3000
      });
      return;
    }
    this.loadingRating = true;
    this.reviewService.save(this.form.value)
      .pipe(
        finalize(() => this.loadingRating = false),
      )
      .subscribe({
        next: (rating: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Rating saved successfully!',
            life: 3000
          });
          this.rateDialog = false;
          this.reviews.push({
            id: rating.id,
            message: this.form.get('message')?.value,
            rating: this.form.get('rating')?.value
          });
          this.form.reset();
          this.hasRating = true;
        },
      });
  }
}
