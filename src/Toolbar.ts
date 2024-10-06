import * as styles from './Toolbar.css';

import { GrabEtching } from './GrabEtching';

import { ToolbarButton } from './ToolbarButton';

import { DragTranslater } from '@rnacanvas/forms';

import { Vector } from '@rnacanvas/vectors.oopified';

import type { App } from './App';

/**
 * The toolbar for the RNAcanvas app.
 */
export class Toolbar<Form> {
  private readonly domNode = document.createElement('div');

  private readonly dragTranslater: DragTranslater;

  #targetApp: App<Form>;

  constructor(targetApp: App<Form>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles.toolbar);

    this.domNode.appendChild(GrabEtching());

    let layoutButton = ToolbarButton('Layout');
    layoutButton.addEventListener('click', () => targetApp.openForm(targetApp.forms['layout']));
    layoutButton.style.marginLeft = '16px';
    this.domNode.append(layoutButton);

    let exportButton = ToolbarButton('Export');
    exportButton.addEventListener('click', () => targetApp.openForm(targetApp.forms['export']));
    exportButton.style.marginLeft = '10px';
    this.domNode.append(exportButton);

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
