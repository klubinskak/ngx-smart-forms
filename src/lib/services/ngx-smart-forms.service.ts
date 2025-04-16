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
    this.clearAll();
  }

  /**
   * Removes all references and subscriptions for a specific form.
   * Call this when a form component is destroyed to prevent memory leaks.
   */
  cleanupForm(formGroup: FormGroup): void {
    if (this.subscriptions.has(formGroup)) {
      this.subscriptions.get(formGroup)?.unsubscribe();
      this.subscriptions.delete(formGroup);
    }
    
    this.initialValuesMap.delete(formGroup);
    this.formChangedMap.delete(formGroup);
  }

  /**
   * Cleans up all resources used by the service
   */
  private clearAll(): void {
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

  /**
   * Stores initial values of all current form controls.
   * Call this after form initialization.
   */
  storeInitialValues(formGroup: FormGroup): void {
    if (this.subscriptions.has(formGroup)) {
      this.subscriptions.get(formGroup)!.unsubscribe();
    }

    this.captureInitialValues(formGroup);

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

  /**
   * Updates initial values for newly added controls.
   * Call this when dynamically adding controls to the form.
   */
  updateInitialValuesForNewControls(formGroup: FormGroup): void {
    const currentInitialValues = this.initialValuesMap.get(formGroup) || {};
    const updatedInitialValues = { ...currentInitialValues };
    
    // Capture values for controls that don't have initial values yet
    Object.keys(formGroup.controls).forEach((controlName) => {
      if (!updatedInitialValues[controlName]) {
        const control = formGroup.controls[controlName];
        updatedInitialValues[controlName] = {
          value: control.value,
          disabled: control.disabled,
          validators: control.validator ? [control.validator] : null
        };
      }
    });
    
    this.initialValuesMap.set(formGroup, updatedInitialValues);
  }

  private captureInitialValues(formGroup: FormGroup): void {
    const initialValues: { [key: string]: IControlState } = {};
    
    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.controls[controlName];
      initialValues[controlName] = {
        value: control.value,
        disabled: control.disabled,
        validators: control.validator ? [control.validator] : null
      };
    });

    this.initialValuesMap.set(formGroup, initialValues);
  }

  resetToInitialValues(formGroup: FormGroup): void {
    const initialValues = this.initialValuesMap.get(formGroup);
    if (!initialValues) return;

    try {
      // Create a value-only object for form reset
      const valuesOnly = Object.keys(initialValues).reduce((acc, key) => {
        acc[key] = initialValues[key].value;
        return acc;
      }, {} as Record<string, any>);
      
      formGroup.patchValue(valuesOnly); // Use patchValue instead of setValue
    } catch (error) {
      // Fallback: reset controls individually
      Object.keys(initialValues).forEach((controlName) => {
        if (formGroup.controls[controlName]) {
          formGroup.controls[controlName].setValue(initialValues[controlName].value);
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
      if (formGroup.controls[controlName] && initialValues[controlName]) {
        formGroup.controls[controlName].setValue(initialValues[controlName].value);
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

    return Object.keys(formGroup.controls).some((key) => {
      // Skip controls that don't have initial values (added dynamically after initialization)
      if (!initialValues[key]) return false;
      
      const currentValue = formGroup.controls[key].value;
      const initialValue = initialValues[key].value;
      return currentValue !== initialValue;
    });
  }
}
