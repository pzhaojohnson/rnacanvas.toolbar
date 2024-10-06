import type { Toolbar } from './Toolbar';

/**
 * The app interface used by the toolbar.
 */
export interface App<B, F> {
  readonly drawing: {
    /**
     * All bases in the drawing of the app.
     *
     * The ordering of bases in this iterable
     * is the ordering of bases in the drawing of the app.
     */
    readonly bases: Iterable<B>;
  };

  /**
   * Represents the set of currently selected bases.
   */
  readonly selectedBases: {
    [Symbol.iterator](): Iterator<B>;

    /**
     * Adds all of the specified bases to the set of currently selected bases.
     */
    addAll(bases: Iterable<B>): void;
  };

  openForm(form: F): void;

  forms: {
    'layout': F;
    'export': F;
  };
}
