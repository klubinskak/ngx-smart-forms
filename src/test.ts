// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';

// This will initialize the Angular testing environment
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Initialize the testing environment
// Using a global function to avoid type mismatches between node_modules and project's node_modules
const ENV_SETUP = () => {
  try {
    // Prevent Angular from re-initializing
    if (getTestBed().platform) return;
    
    getTestBed().initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  } catch (error) {
    console.error('Error during Angular test environment initialization', error);
  }
};

ENV_SETUP(); 