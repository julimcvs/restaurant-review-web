import {Component, OnInit} from '@angular/core';
import {SharedModule} from "../../../shared/shared.module";
import {FormBuilder, Validators} from "@angular/forms";
import {CategoryList, CategoryService} from "../../../services/categories.service";
import {Router} from "@angular/router";
import {RestaurantService} from "../../../services/restaurant.service";

@Component({
  selector: 'app-new-restaurant',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './new-restaurant.component.html',
  styleUrl: './new-restaurant.component.scss'
})
export class NewRestaurantComponent implements OnInit {
  loading = false;
  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    categoryId: [null, Validators.required],
    address: this.formBuilder.group({
      street: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      neighborhood: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      zipCode: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    }),
  });
  categories: CategoryList[] = [];
  filteredCategories: CategoryList[] = [];

  constructor(private readonly restaurantService: RestaurantService,
              private readonly categoryService: CategoryService,
              private readonly formBuilder: FormBuilder,
              private readonly router: Router) {
  }

  async ngOnInit() {
    await this.getCategories();
  }

  async getCategories() {
    this.categoryService.findAll().subscribe((categories) => {
      this.categories = categories;
      this.filterCategory('')
    });
  }

  filterCategory(query: string) {
    if (!query?.trim()) {
      this.filteredCategories = [...this.categories];
    }
    this.filteredCategories = this.categories.filter(category => category.name.toLowerCase().includes(query.toLowerCase()));
  }

  saveRestaurant() {
    this.loading = true;
    this.restaurantService.save(this.form.value).subscribe(async () => {
      this.form.reset();
      await this.router.navigate(['/restaurants']);
      this.loading = false;
    });
  }
}
