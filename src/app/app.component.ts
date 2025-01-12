import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToolbarModule} from "primeng/toolbar";
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "./services/api.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    ApiService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'restaurant-review-web';
}
