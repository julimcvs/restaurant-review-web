import { NgModule } from '@angular/core';
import {CommonModule, NgStyle} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {RatingModule} from "primeng/rating";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";



@NgModule({
  imports: [
    ButtonModule,
    CardModule,
    NgStyle,
    RatingModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    ButtonModule,
    CardModule,
    RatingModule,
    FormsModule,
    NgStyle,
    RouterModule
  ]
})
export class SharedModule { }
