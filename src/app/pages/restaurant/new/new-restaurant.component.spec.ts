import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRestaurantComponent } from './new-restaurant.component';

describe('NewComponent', () => {
  let component: NewRestaurantComponent;
  let fixture: ComponentFixture<NewRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRestaurantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
