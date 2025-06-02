import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'forms-error-label',
  imports: [],
  templateUrl: './forms-error-label.component.html',
  styleUrl: './forms-error-label.component.css',
})
export class FormsErrorLabelComponent {
  control = input.required<AbstractControl>();

  get errorMessage() {
    const errors: ValidationErrors = this.control().errors || {}


    return this.control().touched && Object.keys(errors).length > 0
    ? FormUtils.getTextError(errors) : null
  }
 }
