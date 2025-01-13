import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToolbarModule} from "primeng/toolbar";
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "./services/api.service";
import {CommonModule} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    ToastModule,
    ToolbarModule,
  ],
  providers: [
    ApiService,
    MessageService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'restaurant-review-web';
}
