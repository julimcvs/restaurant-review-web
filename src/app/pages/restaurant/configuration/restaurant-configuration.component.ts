import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {MessageService} from "primeng/api";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SharedModule} from "../../../shared/shared.module";
import {StepsModule} from "primeng/steps";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RestaurantService} from "../../../services/restaurant.service";

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    Button,
    CardModule,
    ProgressSpinnerModule,
    SharedModule,
    StepsModule
  ],
  templateUrl: './restaurant-configuration.component.html',
  styleUrl: './restaurant-configuration.component.scss'
})
export class RestaurantConfigurationComponent implements OnInit {
  form = this.formBuilder.group({
    vacancyInterval: new FormControl<number>(30, [Validators.required, Validators.min(0), Validators.max(120)]),
    schedules: this.formBuilder.array(this.generateSchedules()),
    tableSettings: this.formBuilder.array<FormGroup>([])
  });
  loading = false;
  loadingConfiguration = false;
  restaurantId!: number;
  daysOfWeek: any[] = [];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly route: ActivatedRoute,
              private readonly messageService: MessageService,
              private readonly router: Router,
              private readonly restaurantService: RestaurantService,
  ) {
  }

  get schedules() {
    return this.form.get("schedules") as FormArray;
  }

  get tableSettings() {
    return this.form.get("tableSettings") as FormArray;
  }

  async ngOnInit() {
    if (!this.route.snapshot.params['id']) {
      this.messageService.add({
        severity: 'error',
        summary: 'Client Error',
        detail: 'This restaurant does not exist',
      });
      await this.router.navigate(['/restaurants']);
    }
    this.restaurantId = parseInt(this.route.snapshot.params['id']);
    this.generateDaysOfWeek();
    this.addTableSetting({
      tableFor: 2,
      vacancyAmount: 1
    });
    this.findRestaurantConfiguration(this.restaurantId);
  }

  addTableSetting(setting?: { tableFor: number; vacancyAmount: number; }): void {
    const tableSetting = this.formBuilder.group({
      tableFor: [setting?.tableFor ?? null, [this.tableForUniqueValidator(this.tableSettings), Validators.required]],
      vacancyAmount: [setting?.vacancyAmount ?? null, [Validators.required]],
    });

    this.tableSettings.push(tableSetting);
  }

  getValueDayOfWeek(day: string): number {
    const days = {
      MONDAY: 0,
      TUESDAY: 1,
      WEDNESDAY: 2,
      THURSDAY: 3,
      FRIDAY: 4,
      SATURDAY: 5,
      SUNDAY: 6
    } as const;
    // @ts-ignore
    return days[day];
  }

  getDayAbbreviation(dayOfWeek: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayOfWeek];
  }

  saveConfiguration() {
    if (!this.form.valid) {
      return;
    }
    this.restaurantService.updateConfiguration(this.restaurantId, this.form.value).subscribe({
      next: async () => {
        this.form.reset();
        await this.router.navigate(['/restaurants']);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Restaurant configured successfully!',
          life: 3000
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to configure restaurant',
          life: 3000
        });
      },
      complete: () => this.loading = false
    });
  }

  toggleFormGroup(schedule: any, event: any) {
    if (event.checked) {
      schedule.enable();
      return;
    }
    schedule.disable();
  }

  private findRestaurantConfiguration(restaurantId: number) {
    this.loadingConfiguration = true;
    this.restaurantService.findConfigurationById(restaurantId).subscribe({
      next: async (configuration) => {
        if (!configuration) {
          return;
        }
        const {vacancyInterval, schedules, tableSettings} = configuration;
        if (vacancyInterval) {
          this.form.get("vacancyInterval")?.setValue(vacancyInterval);
        }
        if (schedules) {
          this.schedules.controls.forEach((control, i) => {
            const schedule = schedules.find(sc => this.getValueDayOfWeek(sc.dayOfWeek as string) === control.get("dayOfWeek")?.value);
            if (schedule) {
              control.get("openingTime")?.setValue(schedule.openingTime);
              control.get("closingTime")?.setValue(schedule.closingTime);
            } else {
              this.daysOfWeek[i] = false;
              control.disable();
            }
          })
        }
        if (tableSettings) {
          tableSettings.forEach(tableSetting => {
            const control = this.tableSettings.controls.find(ts => tableSetting.tableFor === ts.get("tableFor")?.value);
            if (control) {
              control.get("vacancyAmount")?.setValue(tableSetting.vacancyAmount);
            } else {
              this.addTableSetting({
                tableFor: tableSetting.tableFor as number,
                vacancyAmount: tableSetting.vacancyAmount as number,
              })
            }
          })
        }
      },
      error: () => this.router.navigate(['/restaurants']),
      complete: () => this.loadingConfiguration = false
    })
  }

  private generateDaysOfWeek() {
    Array.from({length: 7}, (_, index) =>
      this.daysOfWeek[index] = true
    );
  }

  private generateSchedules() {
    return Array.from({length: 7}, (_, index) =>
      this.formBuilder.group({
        dayOfWeek: new FormControl(index, Validators.required),
        openingTime: new FormControl('17:00', Validators.required),
        closingTime: new FormControl('23:00', Validators.required),
        enabled: new FormControl(true),
      })
    );
  }

  private tableForUniqueValidator(formArray: FormArray): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const isDuplicate = formArray.controls.some((group) => {
        return group !== control.parent && group.get('tableFor')?.value === control.value;
      });

      return isDuplicate ? {tableForNotUnique: true} : null;
    };
  }
}
