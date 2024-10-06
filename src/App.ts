import type { Toolbar } from './Toolbar';

/**
 * The app interface used by the toolbar.
 */
export interface App<Form> {
  openForm(form: Form): void;

  forms: {
    'layout': Form;
    'export': Form;
  };

  /**
   * The toolbar of the app.
   */
  toolbar: Toolbar<Form>;
}
