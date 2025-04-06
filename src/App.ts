import type { Nucleobase } from './Nucleobase';

import type { SecondaryBond } from './SecondaryBond';

/**
 * The app interface used by the toolbar.
 */
export interface App<B extends Nucleobase, F> {
  readonly drawing: {
    readonly domNode: SVGSVGElement;

    /**
     * All bases in the drawing of the app.
     *
     * The ordering of bases in this iterable
     * is the ordering of bases in the drawing of the app.
     */
    readonly bases: Iterable<B>;

    /**
     * Rotates the specified bases by the given angle.
     *
     * Also rotates any elements attached to the bases (such as base numberings).
     */
    rotate(bases: B[], angle: number): void;

    readonly horizontalClientScaling: number;
    readonly verticalClientScaling: number;

    /**
     * All secondary bonds in the drawing.
     */
    readonly secondaryBonds: Iterable<SecondaryBond<B>>;

    /**
     * Adds a secondary bond between the two bases.
     */
    addSecondaryBond(base1: Nucleobase, base2: Nucleobase): void;
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

    /**
     * The specified listener is to be called
     * whenever the set of currently selected bases changes.
     */
    addEventListener(name: 'change', listener: () => void): void;
  };

  beforeDragging(): void;
  afterDragging(): void;

  undo(): void | never;
  redo(): void | never;

  pushUndoStack(): void;

  undoStack: {
    isEmpty(): boolean;

    /**
     * For listening for whenever the undo stack is pushed onto or popped off of.
     */
    addEventListener(name: 'change', listener: () => void): void;
  }

  redoStack: {
    isEmpty(): boolean;

    /**
     * For listening for whenever the redo stack is pushed onto or popped off of.
     */
    addEventListener(name: 'change', listener: () => void): void;
  }

  openForm(form: F | 'edit'): void;

  forms: {
    'layout': F;
  };
}
