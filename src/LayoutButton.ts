import * as styles from './LayoutButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { KeyBinding } from '@rnacanvas/utilities';

import { Tooltip } from '@rnacanvas/tooltips';

export class LayoutButton<B extends Nucleobase, F> {
  readonly domNode;

  #button;

  #tooltip = new Tooltip('');

  #targetApp;

  #keyBindings: KeyBinding[] = [];

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.#button = new ToolbarButton('Layout');
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.cursor = 'pointer';

    this.domNode = document.createElement('div');
    this.domNode.classList.add(styles['layout-button']);
    this.domNode.append(this.#button.domNode);

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#keyBindings.push(new KeyBinding('L', () => this.press()));
    this.#keyBindings.forEach(kb => kb.owner = this.domNode);

    this.#tooltip.owner = this.domNode;

    this.#refresh();
  }

  #refresh(): void {
    let boundKey = '[ L ]';

    this.#tooltip.textContent = `Open the Layout form. ${boundKey}`;
  }

  press(): void {
    this.#targetApp.openForm(this.#targetApp.forms['layout']);
  }

  get keyBindings(): Iterable<{ owner: Element | undefined }> {
    return [...this.#keyBindings];
  }
}
