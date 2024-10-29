import * as styles from './ExportButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { KeyBinding } from '@rnacanvas/utilities';

export class ExportButton<B extends Nucleobase, F> {
  readonly domNode;

  #button;

  #tooltip;

  #targetApp;

  #keyBindings: KeyBinding[] = [];

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

    this.#keyBindings.push(new KeyBinding('E', () => this.press()));
    this.#keyBindings.forEach(kb => kb.scope = this.domNode);

    this.#refresh();
  }

  #refresh(): void {
    let boundKey = '[ E ]';

    this.#tooltip.textContent = `Open the Export form. ${boundKey}`;
  }

  press(): void {
    this.#targetApp.openForm(this.#targetApp.forms['export']);
  }

  get keyBindings(): Iterable<{ scope: Element | undefined }> {
    return [...this.#keyBindings];
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
