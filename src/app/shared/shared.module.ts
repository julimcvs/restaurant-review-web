import {NgModule} from '@angular/core';
import {CommonModule, NgClass, NgStyle} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {RatingModule} from "primeng/rating";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {InputTextModule} from "primeng/inputtext";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldsetModule} from "primeng/fieldset";
import {InputMaskModule} from "primeng/inputmask";
import {AutoCompleteModule} from "primeng/autocomplete";
import {FileUploadModule} from "primeng/fileupload";
import {BadgeModule} from "primeng/badge";


@NgModule({
  imports: [
    ButtonModule,
    CardModule,
    NgStyle,
    RatingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    InputTextareaModule,
    FieldsetModule,
    InputMaskModule,
    AutoCompleteModule,
    CommonModule,
    FileUploadModule,
    BadgeModule,
    NgClass,
  ],
  exports: [
    ButtonModule,
    CardModule,
    RatingModule,
    FormsModule,
    NgStyle,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    InputTextareaModule,
    FieldsetModule,
    InputMaskModule,
    AutoCompleteModule,
    FileUploadModule,
    BadgeModule,
    NgClass,

  ]
})
export class SharedModule {
}
