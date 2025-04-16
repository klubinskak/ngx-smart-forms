import { ValidatorFn } from "@angular/forms";

export interface IControlState {
    value: any;
    disabled: boolean;
    validators: ValidatorFn[] | null;
  }