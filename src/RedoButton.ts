import * as styles from './RedoButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { KeyBinding } from '@rnacanvas/utilities';

import { Tooltip } from '@rnacanvas/tooltips';

import { detectMacOS } from '@rnacanvas/utilities';

export class RedoButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip = new Tooltip('');

  #targetApp;

  #keyBindings: KeyBinding[] = [];

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['redo-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    icon.innerHTML = `
      <path
        d="M 14 18 H 8 A 6 6 0 1 1 8 6 h 10"
        stroke="white" stroke-width="1" fill="none"
      ></path>
      <path
        d="M 18 6 v -4 l 4 4 l -4 4 v -4 z"
        stroke="white" stroke-width="1" fill="white"
      ></path>
    `;

    this.#button = new ToolbarButton(icon);
    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.padding = '4px 6px';
    this.domNode.append(this.#button.domNode);

    this.#tooltip.owner = this.domNode;

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#keyBindings.push(new KeyBinding('Z', () => this.press(), { ctrlKey: true, shiftKey: true }));
    this.#keyBindings.push(new KeyBinding('Z', () => this.press(), { metaKey: true, shiftKey: true }));

    this.#keyBindings.forEach(kb => kb.owner = this.domNode);

    targetApp.redoStack.addEventListener('change', () => this.#refresh());

    this.#refresh();
  }

  #disable(): void {
    this.#button.disable();

    this.#button.domNode.classList.remove(styles['clickable']);
    this.#button.domNode.classList.add(styles['draggable']);
  }

  #enable(): void {
    this.#button.enable();

    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.classList.remove(styles['draggable']);
  }

  isDisabled(): boolean {
    return this.#button.isDisabled();
  }

  #updateTooltipText(): void {
    let boundKey = detectMacOS() ? '[ ⇧ ⌘ Z ]' : '[ Shift+Ctrl+Z ]';

    if (this.#targetApp.redoStack.isEmpty()) {
      this.#tooltip.textContent = `Can't redo.`;
    } else {
      this.#tooltip.textContent = `Redo. ${boundKey}`;
    }
  }

  #refresh(): void {
    this.#targetApp.redoStack.isEmpty() ? this.#disable() : this.#enable();

    this.#updateTooltipText();
  }

  press() {
    if (this.isDisabled()) {
      return;
    }

    if (!this.#targetApp.redoStack.isEmpty()) {
      this.#targetApp.redo();
    }
  }

  get keyBindings(): Iterable<{ owner: Element | undefined }> {
    return [...this.#keyBindings];
  }
}
