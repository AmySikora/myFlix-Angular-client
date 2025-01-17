/**
 * The main entry point of the Angular application.
 * Bootstraps the root module (`AppModule`) to launch the application.
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

/**
 * Bootstraps the `AppModule` to start the application.
 * If an error occurs during bootstrap, it will be logged to the console.
 */
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error('Error bootstrapping the module:', err));
