import {
  Injectable,
  OnDestroy,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IControlState } from '../models/form';

@Injectable({
  providedIn: 'any',
})
export class NgxSmartFormsService implements OnDestroy {
  private initialValuesMap = new Map<
    FormGroup,
    { [key: string]: IControlState }
  >();
  private formChangedMap = new Map<FormGroup, WritableSignal<boolean>>();
  private subscriptions = new Map<FormGroup, Subscription>();

  ngOnDestroy(): void {
    this.initialValuesMap.clear();
    this.formChangedMap.clear();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
  }

  getFormChanged(formGroup: FormGroup): Signal<boolean> {
    if (!this.formChangedMap.has(formGroup)) {
      this.formChangedMap.set(formGroup, signal(false));
    }
    return this.formChangedMap.get(formGroup)!;
  }

  storeInitialValues(formGroup: FormGroup): void {
    if (this.subscriptions.has(formGroup)) {
      this.subscriptions.get(formGroup)!.unsubscribe();
    }

    const initialValues: { [key: string]: any } = {};
    Object.keys(formGroup.controls).forEach((controlName) => {
      initialValues[controlName] = formGroup.controls[controlName].value;
    });

    this.initialValuesMap.set(formGroup, initialValues);

    if (!this.formChangedMap.has(formGroup)) {
      this.formChangedMap.set(formGroup, signal(false));
    }
    const formChanged = this.formChangedMap.get(formGroup)!;

    const sub = formGroup.valueChanges.subscribe(() => {
      const changed = this.hasFormChanged(formGroup);
      formChanged.set(changed);
    });

    this.subscriptions.set(formGroup, sub);
  }

  resetToInitialValues(formGroup: FormGroup): void {
    const initialValues = this.initialValuesMap.get(formGroup);
    if (!initialValues) return;

    try {
      formGroup.setValue(initialValues);
    } catch {
      Object.keys(initialValues).forEach((controlName) => {
        if (formGroup.controls[controlName]) {
          formGroup.controls[controlName].setValue(initialValues[controlName]);
        }
      });
    }

    formGroup.markAsPristine();
  }

  resetControlsToInitialValue(
    formGroup: FormGroup,
    controlNames: string[],
  ): void {
    const initialValues = this.initialValuesMap.get(formGroup);
    if (!initialValues) return;

    controlNames.forEach((controlName) => {
      if (formGroup.controls[controlName]) {
        formGroup.controls[controlName].setValue(initialValues[controlName]);
      }
    });
  }

  canDeactivate(formGroup: FormGroup): boolean {
    if (!this.formChangedMap.has(formGroup)) return true;
    return !this.getFormChanged(formGroup)();
  }

  private hasFormChanged(formGroup: FormGroup): boolean {
    const initialValues = this.initialValuesMap.get(formGroup);
    if (!initialValues) return false;

    return Object.keys(initialValues).some((key) => {
      const currentValue = formGroup.controls[key].value;
      const initialValue = initialValues[key];
      return currentValue !== initialValue;
    });
  }
}
