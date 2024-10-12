import * as styles from './Toolbar.css';

import { GrabEtching } from './GrabEtching';

import { ToolbarButton } from './ToolbarButton';

import { SelectInterveningButton } from './SelectInterveningButton';

import { ShiftButton } from './ShiftButton';

import { RotateButton } from './RotateButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { DragTranslater } from '@rnacanvas/forms';

import { Vector } from '@rnacanvas/vectors.oopified';

/**
 * The toolbar for the RNAcanvas app.
 */
export class Toolbar<B extends Nucleobase, F> {
  private readonly domNode = document.createElement('div');

  #targetApp: App<B, F>;

  #selectInterveningButton: SelectInterveningButton<B, F>;

  #shiftButton;

  #rotateButton;

  private readonly dragTranslater: DragTranslater;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles.toolbar);

    this.domNode.appendChild(GrabEtching());

    this.#selectInterveningButton = new SelectInterveningButton(targetApp);
    this.domNode.append(this.#selectInterveningButton.domNode);

    this.#shiftButton = new ShiftButton(targetApp);
    this.domNode.append(this.#shiftButton.domNode);

    this.#rotateButton = new RotateButton(targetApp);
    this.domNode.append(this.#rotateButton.domNode);

    let layoutButton = new ToolbarButton('Layout');
    layoutButton.domNode.addEventListener('click', () => targetApp.openForm(targetApp.forms['layout']));
    layoutButton.domNode.style.marginLeft = '8px';
    this.domNode.append(layoutButton.domNode);

    let exportButton = new ToolbarButton('Export');
    exportButton.domNode.addEventListener('click', () => targetApp.openForm(targetApp.forms['export']));
    exportButton.domNode.style.marginLeft = '2px';
    this.domNode.append(exportButton.domNode);

    this.dragTranslater = new DragTranslater(this.domNode);
    this.dragTranslater.interactionDepth = 'deep';

    // allows the toolbar to be dragged when context-clicking buttons
    // (without opening a context menu or activating buttons)
    this.domNode.oncontextmenu = () => false;
  }

  /**
   * Appends the toolbar to the provided container node.
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the toolbar from any parent container node that it is in.
   *
   * Has no effect if the toolbar did not have a parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  /**
   * Repositions the toolbar to its original position (before any mouse dragging).
   */
  reposition(): void {
    this.dragTranslater.untranslate();
  }

  /**
   * The displacement of the toolbar from its original position
   * (before any dragging with the mouse).
   *
   * Note that currently the values of the returned vector cannot be set
   * to control the displacement of the toolbar.
   */
  get displacement() {
    return Vector.matching(this.dragTranslater.currentTranslation);
  }

  hide(): void {
    this.domNode.style.visibility = 'hidden';
  }

  unhide(): void {
    this.domNode.style.visibility = 'visible';
  }

  isHidden(): boolean {
    // keep in mind that an invalid visibility style value results in a visible element
    return ['hidden', 'collapse'].includes(this.domNode.style.visibility);
  }
}
