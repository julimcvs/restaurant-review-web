import {Component, OnInit} from '@angular/core';
import {SharedModule} from "../../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MenuItem, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {RestaurantConfiguration, RestaurantService} from "../../../services/restaurant.service";
import {finalize, map} from "rxjs";
import {ReservationService, SaveReservation} from "../../../services/reservation.service";

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
  active = 0;
  availableDates: Date[] = [];
  configuration!: RestaurantConfiguration;
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
    date: new FormControl<Date | null>(null, Validators.required),
    tableFor: new FormControl<number | null>(null, Validators.required),
    selectedTime: new FormControl<string | null>(null, Validators.required),
  });
  loading = false;
  loadingConfiguration = false;
  loadingVacancies = false;
  restaurantId!: number;
  vacancies!: string[];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly messageService: MessageService,
              private readonly restaurantService: RestaurantService,
              private readonly reservationService: ReservationService,
  ) {
  }

  get selectedDate() {
    return this.form.get('date');
  }

  get tableFor() {
    return this.form.get('tableFor');
  }

  get selectedTime() {
    return this.form.get('selectedTime');
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
    this.generateAvailableDates();
    this.findRestaurantConfiguration(this.restaurantId);
  }

  findVacancies() {
    const date = this.selectedDate?.getRawValue();
    this.loadingVacancies = true;
    this.restaurantService.findVacanciesById({
      tableFor: this.tableFor?.getRawValue(),
      date: `${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2, 0)}/${date.getFullYear()}`,
    }, this.restaurantId)
      .pipe(
        finalize(() => this.loadingVacancies = false),
        map(result => result.vacancies)
      )
      .subscribe({
        next: (vacancies) => {
          this.vacancies = vacancies;
        }
      });
  }

  getMonth(date: Date) {
    const month = date.getMonth();
    switch (month) {
      case 0:
        return 'Jan';
      case 1:
        return 'Feb';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'May';
      case 5:
        return 'Jun';
      case 6:
        return 'Jul';
      case 7:
        return 'Aug';
      case 8:
        return 'Sep';
      case 9:
        return 'Oct';
      case 10:
        return 'Nov';
      case 11:
        return 'Dec';
      default:
        return 'Invalid month';
    }
  }

  next() {
    switch (this.active) {
      case 0:
        if (!this.selectedDate?.value) {
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
    this.loading = true;
    const { selectedTime, date, tableFor } = this.form.getRawValue();

    // Ensure we have a valid date instance
    const scheduledDate = date ? new Date(date) : new Date();

    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);
    }

    const body: SaveReservation = {
      tableFor: tableFor as number,
      restaurantId: this.restaurantId,
      scheduledDate
    };

    this.reservationService.save(body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Reservation saved',
            detail: 'Reservation saved successfully.',
          });
          this.router.navigate(['/restaurants']);
        }
      });
  }

  selectDate(input: Date) {
    this.selectedDate?.setValue(input);
  }

  selectTableFor(tableSetting: number) {
    this.tableFor?.setValue(tableSetting);
  }

  selectTime(vacancy: string) {
    this.selectedTime?.setValue(vacancy);
  }

  private findRestaurantConfiguration(restaurantId: number) {
    this.loadingConfiguration = true;
    this.restaurantService.findConfigurationById(restaurantId).subscribe({
      next: async (configuration) => {
        if (!configuration) {
          return;
        }
        this.configuration = configuration;
      },
      error: () => this.router.navigate(['/restaurants']),
      complete: () => this.loadingConfiguration = false
    })
  }

  private generateAvailableDates() {
    const today = new Date();
    this.availableDates = Array.from({length: 7}, (_, index) => {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + index);
      return newDate;
    });
  }
}
