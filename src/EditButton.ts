import * as styles from './EditButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { Tooltip } from '@rnacanvas/tooltips';

export class EditButton<B extends Nucleobase, F> {
  readonly domNode;

  #button;

  #tooltip = new Tooltip('Open the Editing form.');

  #targetApp;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.#button = new ToolbarButton('Edit');
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.cursor = 'pointer';

    this.domNode = document.createElement('div');
    this.domNode.classList.add(styles['edit-button']);
    this.domNode.append(this.#button.domNode);

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 12;
  }

  press(): void {
    this.#targetApp.openForm('edit');
  }
}
