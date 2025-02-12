import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RestaurantConfigurationComponent} from './restaurant-configuration.component';

describe('ConfigurationComponent', () => {
  let component: RestaurantConfigurationComponent;
  let fixture: ComponentFixture<RestaurantConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
