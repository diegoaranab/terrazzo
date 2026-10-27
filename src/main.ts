import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { App } from './app/app';

bootstrapApplication(App, { providers: [provideHttpClient(), provideBrowserGlobalErrorListeners()] })
  .catch(error => console.error(error));
