import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import {PasswordModule} from "primeng/password";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    SharedModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginLoading = false;

  login(event: any) {
    console.log(event);
  }
}
