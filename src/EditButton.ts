import * as styles from './EditButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

export class EditButton<B extends Nucleobase, F> {
  readonly domNode;

  #button;

  #tooltip;

  #targetApp;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.#button = new ToolbarButton('Edit');
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.cursor = 'pointer';

    this.#tooltip = new Tooltip();

    this.domNode = document.createElement('div');
    this.domNode.classList.add(styles['edit-button']);
    this.domNode.append(this.#button.domNode, this.#tooltip.domNode);

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;
  }

  press(): void {
    this.#targetApp.openForm('edit');
  }
}

class Tooltip {
  readonly domNode;

  #p;

  constructor() {
    this.#p = document.createElement('p');
    this.#p.classList.add(styles['tooltip-text']);
    this.#p.textContent = 'Open the Editing form.';

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#p);

    this.domNode = document.createElement('div');
    this.domNode.classList.add(styles['tooltip']);
    this.domNode.append(textContainer);
  }
}
