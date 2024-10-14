import * as styles from './ExportButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

export class ExportButton<B extends Nucleobase, F> {
  readonly domNode;

  #button;

  #tooltip;

  #boundKey?: string;

  #targetApp;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.#button = new ToolbarButton('Export');
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.cursor = 'pointer';

    this.#tooltip = new Tooltip();

    this.domNode = document.createElement('div');
    this.domNode.classList.add(styles['export-button']);
    this.domNode.append(this.#button.domNode, this.#tooltip.domNode);

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#refresh();
  }

  #refresh(): void {
    let boundKey = this.#boundKey ? `[ ${this.#boundKey} ]` : '';

    this.#tooltip.textContent = `Open the Export form. ${boundKey}`;
  }

  press(): void {
    this.#targetApp.openForm(this.#targetApp.forms['export']);
  }

  /**
   * The key that the button has been bound to.
   *
   * Is displayed in the tooltip for the button when set.
   */
  get boundKey() {
    return this.#boundKey;
  }

  set boundKey(boundKey) {
    this.#boundKey = boundKey;

    this.#refresh();
  }
}

class Tooltip {
  readonly domNode;

  #p;

  constructor() {
    this.#p = document.createElement('p');
    this.#p.classList.add(styles['tooltip-text']);

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#p);

    this.domNode = document.createElement('div');
    this.domNode.classList.add(styles['tooltip']);
    this.domNode.append(textContainer);
  }

  get textContent() {
    return this.#p.textContent;
  }

  set textContent(textContent) {
    this.#p.textContent = textContent;
  }
}
