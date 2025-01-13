import {Component, OnInit} from '@angular/core';
import {SharedModule} from "../../../shared/shared.module";
import {FormBuilder, Validators} from "@angular/forms";
import {CategoryList, CategoryService} from "../../../services/categories.service";
import {Router} from "@angular/router";
import {RestaurantService} from "../../../services/restaurant.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {CommonModule} from "@angular/common";
import {FileSelectEvent} from "primeng/fileupload";

@Component({
  selector: 'app-new-restaurant',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule
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
  files: File[] = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;

  constructor(private readonly restaurantService: RestaurantService,
              private readonly categoryService: CategoryService,
              private readonly formBuilder: FormBuilder,
              private readonly config: PrimeNGConfig,
              private readonly messageService: MessageService,
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
    const formData = new FormData();
    formData.append('body', JSON.stringify(this.form.value));
    this.files.forEach((file) => {
      formData.append('images', file);
    });
    this.restaurantService.save(formData).subscribe({
      next: async () => {
        this.form.reset();
        await this.router.navigate(['/restaurants']);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Restaurant created successfully!',
          life: 3000
        });
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create restaurant',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  choose(event: MouseEvent, callback: Function) {
    callback();
  }

  onRemoveTemplatingFile(event: MouseEvent, file: File, removeFileCallback: Function, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: Function) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'File Uploaded', life: 3000});
  }

  onSelectedFiles(event: FileSelectEvent) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: Function) {
    callback();
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes || ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return `0B`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
}
