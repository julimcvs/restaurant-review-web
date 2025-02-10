import {Component, OnInit} from '@angular/core';
import {SharedModule} from "../../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MenuItem, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {RestaurantService, RestaurantSettings, Vacancy} from "../../../services/restaurant.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {
  loading = false;
  loadingSettings = false;
  loadingVacancies = false;
  active = 0;
  items: MenuItem[] = [
    {
      label: 'Date',
    },
    {
      label: 'Table for'
    },
    {
      label: 'Time'
    },
  ]
  form = this.formBuilder.group({
    date: new FormControl<string | null>(null, Validators.required),
    tableFor: new FormControl<number | null>(null, Validators.required),
    vacancyId: new FormControl<number | null>(null, Validators.required)
  });
  restaurantId!: number;
  settings!: RestaurantSettings;
  vacancies!: Vacancy[];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly messageService: MessageService,
              private readonly restaurantService: RestaurantService
  ) {
  }

  get date() {
    return this.form.get('date');
  }

  get tableFor() {
    return this.form.get('tableFor');
  }

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      this.messageService.add({
        severity: 'error',
        summary: 'Client Error',
        detail: 'This restaurant does not exist',
      });
      this.router.navigate(['/restaurants']);
    }
    this.restaurantId = parseInt(this.route.snapshot.params['id']);
    this.findRestaurantSettings(this.restaurantId);
  }

  findRestaurantSettings(restaurantId: number) {
    this.restaurantService.findSettingsById(restaurantId)
      .pipe(
        finalize(() => this.loadingSettings = false)
      )
      .subscribe({
        next: (settings: RestaurantSettings) => {
          this.settings = settings;
        }
      })
  }

  findVacancies() {
    this.restaurantService.findVacanciesById(this.restaurantId, {
      date: this.date?.getRawValue(),
      tableFor: this.form.get('tableFor')?.getRawValue(),
    })
      .pipe(
        finalize(() => this.loadingVacancies = false)
      )
      .subscribe({
        next: (vacancies: Vacancy[]) => {
          this.vacancies = vacancies;
        }
      })
  }

  getSplitDate(date: string) {
    return date.split('/');
  }

  getDay(date: string) {
    return this.getSplitDate(date)[0];
  }

  getMonth(date: string) {
    const month = this.getSplitDate(date)[1];
    switch (month) {
      case '01':
        return 'Jan';
      case '02':
        return 'Feb';
      case '03':
        return 'Mar';
      case '04':
        return 'Apr';
      case '05':
        return 'May';
      case '06':
        return 'Jun';
      case '07':
        return 'Jul';
      case '08':
        return 'Aug';
      case '09':
        return 'Sep';
      case '10':
        return 'Oct';
      case '11':
        return 'Nov';
      case '12':
        return 'Dec';
      default:
        return 'Invalid month'; // If the month is not a valid number
    }
  }

  next() {
    switch (this.active) {
      case 0:
        if (!this.date?.value) {
          this.messageService.add({
            severity: 'error',
            summary: 'Fill all required fields',
            detail: 'Please select a date for your reservation.',
          })
          return;
        }
        this.active++;
        break;
      case 1:
        if (!this.tableFor?.value) {
          this.messageService.add({
            severity: 'error',
            summary: 'Fill all required fields',
            detail: 'Please select a table setting.',
          })
          return;
        }
        this.findVacancies();
        this.active++;
        break;
    }
  }

  back() {
    if (this.active > 0) {
      this.active--;
    }
  }

  saveReservation() {
    // TODO
  }

  selectDate(date: string) {
    this.date?.setValue(date);
  }

  selectTableFor(tableSetting: number) {
    this.tableFor?.setValue(tableSetting);
  }
}
