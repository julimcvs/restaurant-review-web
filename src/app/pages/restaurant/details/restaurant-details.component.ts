import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {RestaurantDetails, RestaurantService} from "../../../services/restaurant.service";
import {MessageService, SelectItem} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReviewService} from "../../../services/review.service";

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
  loadingRestaurant = false;
  loadingRating = false;
  rateDialog = false;
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
    this.restaurantService.findById(this.restaurantId).subscribe({
      next: (restaurant) => {
        this.restaurant = restaurant;
        this.images = restaurant.images.map(image => ({
          itemImageSrc: image.url,
          thumbnailImageSrc: image.url,
          alt: image.filename,
          title: image.filename,
        }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch restaurant details',
          life: 3000
        });
        this.closeEvent.emit(this.restaurantId);
      },
      complete: () => {
        this.loadingRestaurant = false;
      }
    });
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
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
    try {
      this.reviewService.save(this.form.value).subscribe({
        next: (rating: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Rating saved successfully!',
            life: 3000
          });
          this.rateDialog = false;
          this.restaurant.ratings.push({
            id: rating.id,
            message: this.form.get('message')?.value,
            rating: this.form.get('rating')?.value
          });
          this.form.reset();
          this.hasRating = true;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save rating',
            life: 3000
          });
        },
      });
    } finally {
      this.loadingRating = false;
    }
  }
}
