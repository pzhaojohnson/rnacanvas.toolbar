import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import * as styles from './FindButton.css';

import { ToolbarButton } from './ToolbarButton';

import { Tooltip } from '@rnacanvas/tooltips';

import { detectMacOS } from '@rnacanvas/utilities';

import { KeyBinding } from '@rnacanvas/utilities';

export class FindButton<B extends Nucleobase, F> {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #button;

  readonly #tooltip = new Tooltip(`Open the Find form. ${
    detectMacOS() ? (
      '[ ⌘ F ]'
    ) : (
      '[ Ctrl+F ]'
    )
  }`);

  readonly #keyBindings: KeyBinding[] = [];

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['find-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.setAttribute('viewBox', '0 0 24 24');

    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    icon.innerHTML = `
      <circle
        r="6" cx="8" cy="8"
        stroke="white" stroke-width="1"
      ></circle>
      <line
        x1="12.24" y1="12.24" y2="21" x2="21"
        stroke="white" stroke-width="2"
      ></line>
    `;

    this.#button = new ToolbarButton(icon);

    this.#button.domNode.classList.add(styles['clickable']);

    this.#button.domNode.addEventListener('click', () => this.press());

    this.#button.domNode.style.padding = '4px 6px';

    this.domNode.append(this.#button.domNode);

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 11;

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#keyBindings.push(new KeyBinding('F', () => this.press(), { ctrlKey: true }));
    this.#keyBindings.push(new KeyBinding('F', () => this.press(), { metaKey: true }));

    this.#keyBindings.forEach(kb => kb.owner = this.domNode);
  }

  press() {
    this.#targetApp.openForm('find');
  }

  get keyBindings(): Iterable<{ owner: Element | undefined }> {
    return [...this.#keyBindings];
  }
}
