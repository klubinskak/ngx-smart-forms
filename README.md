# 🤓 ngx-smart-forms

> **Smart, Signal-powered form state utilities for Angular 17+**

[![npm version](https://img.shields.io/npm/v/ngx-smart-forms?style=flat-square)](https://www.npmjs.com/package/ngx-smart-forms)
[![Angular](https://img.shields.io/badge/angular-17%2B-red?style=flat-square&logo=angular)](https://angular.io/)
[![MIT License](https://img.shields.io/npm/l/ngx-smart-forms.svg?style=flat-square)](LICENSE)

**`ngx-smart-forms`** simplifies form management in Angular by adding powerful utilities like:
- Initial value tracking
- Dirty/changed detection via Signals
- Reset to initial state
- Unsaved changes guard (`canDeactivate`)
- `FormDebugPanelComponent` for live dev inspection 🔍 - coming soon 

---

## ✨ Features

✅ Track initial form values  
✅ Detect changes reactively with `WritableSignal<boolean>`  
✅ Reset whole form or selected controls  
✅ `canDeactivate()` helper for unsaved changes  
✅ Angular 17+ & Signals-ready  
✅ Dev-only debug panel component 🧪  
✅ Works with standalone and traditional modules  
✅ Fully tree-shakable & Ivy-compiled

---

## 📦 Installation

```bash
npm install ngx-smart-forms
```

> _Angular v17 or newer required. Uses Signals._

---

## 🚀 Getting Started

### 1. Inject the service

```ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSmartFormsService } from 'ngx-smart-forms';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
})
export class MyFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private smartForms: NgxSmartFormsService
  ) {
    this.form = this.fb.group({
      name: [''],
      email: ['']
    });

    this.smartForms.storeInitialValues(this.form);
  }
}
```

---

### 2. Detect changes using Signals

```ts
readonly formChanged = this.smartForms.getFormChanged(this.form);
```

```html
<p *ngIf="formChanged()">⚠️ You have unsaved changes.</p>
```

---

### 3. Reset to Initial State

```ts
this.smartForms.resetToInitialValues(this.form);
```

Or for selected controls:

```ts
this.smartForms.resetControlsToInitialValue(this.form, ['email']);
```

---

### 4. Prevent Navigation with Unsaved Changes

Use in a `CanDeactivate` guard:

```ts
canDeactivate(): boolean {
  return this.smartForms.canDeactivate(this.form);
}
```

---

## 🧠 Why Use This?

Angular gives you reactive forms, but not:

- Initial state tracking
- Smart "unsaved changes" detection
- Reset logic for dynamic forms
- Signal-powered change tracking

**ngx-smart-forms** solves all that with one clean service.

---

## 📚 API Reference

### `storeInitialValues(formGroup: FormGroup): void`
Stores current form state as initial snapshot.

---

### `getFormChanged(formGroup: FormGroup): Signal<boolean>`
Returns a reactive Signal that updates whenever the form changes.

---

### `resetToInitialValues(formGroup: FormGroup): void`
Restores the full form to its original state.

---

### `resetControlsToInitialValue(formGroup: FormGroup, controls: string[]): void`
Resets selected controls only.

---

### `canDeactivate(formGroup: FormGroup): boolean`
Returns `false` if the form has unsaved changes.

---

## 🤝 Contributing

PRs, issues, and ideas welcome! Open a discussion or fork the repo and send in a pull request 💬

---

## 📝 License

MIT © 2025 [klubinskak]
